/**
 * Payment Service — GiftVerse
 *
 * Stripe-based payment flow. Checkout sessions are created server-side
 * via Supabase Edge Function. The mobile app only handles redirects.
 */
import { supabase } from './supabase';
import type { GiftType, PaymentStatus } from '../types';

// ─── Pricing Config ────────────────────────────────────────
export const PRICING: Record<GiftType, { amount: number; currency: string; label: string; isFree: boolean }> = {
  gift_game: { amount: 299, currency: 'usd', label: '$2.99', isFree: false },
  birthday_card: { amount: 0, currency: 'usd', label: 'Free', isFree: true },
  invitation: { amount: 199, currency: 'usd', label: '$1.99', isFree: false },
};

export interface CheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
}

/**
 * Create a Stripe Checkout session via Supabase Edge Function.
 * The edge function holds STRIPE_SECRET_KEY securely.
 */
export async function createCheckoutSession(giftId: string, giftType: GiftType): Promise<CheckoutResult> {
  const pricing = PRICING[giftType];

  if (pricing.isFree) {
    return { success: true, sessionId: 'free' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        giftId,
        giftType,
        amount: pricing.amount,
        currency: pricing.currency,
      },
    });

    if (error) throw error;
    return data as CheckoutResult;
  } catch (err: any) {
    console.error('Checkout creation failed:', err);
    return { success: false, error: err.message || 'Payment service unavailable' };
  }
}

/**
 * Check payment status for a gift.
 */
export async function getPaymentStatus(giftId: string): Promise<PaymentStatus> {
  const pricing = PRICING[giftId as GiftType]; // quick lookup if giftType passed
  if (pricing?.isFree) return 'free';

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('status')
      .eq('gift_id', giftId)
      .single();

    if (error || !data) return 'pending';
    return data.status as PaymentStatus;
  } catch {
    return 'pending';
  }
}
