/**
 * AI Proxy Service — GiftVerse
 *
 * All AI generation goes through a Supabase Edge Function.
 * The mobile app NEVER holds API secrets.
 */
import { supabase } from './supabase';
import type { GiftExperience, GiftType, GiftOccasion, Tone, VisualStyle, ContentBlock } from '../types';

export interface GenerateGiftRequest {
  giftType: GiftType;
  occasion: GiftOccasion;
  tone: Tone;
  visualStyle: VisualStyle;
  senderName: string;
  recipientName: string;
  personalMessage: string;
  recipientInterests?: string[];
  recipientPersonalities?: string[];
  recipientAge?: string;
  eventDetails?: { date?: string; location?: string };
}

export interface GenerateGiftResponse {
  success: boolean;
  gift?: Partial<GiftExperience>;
  error?: string;
}

/**
 * Call Supabase Edge Function `generate-gift` to produce AI content.
 * Falls back to local generation when Supabase is unreachable.
 */
export async function generateGift(request: GenerateGiftRequest): Promise<GenerateGiftResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-gift', {
      body: request,
    });

    if (error) throw error;
    return data as GenerateGiftResponse;
  } catch (err) {
    console.warn('Edge function unavailable, using fallback generation', err);
    return fallbackGenerate(request);
  }
}

// ─── Fallback (offline / no-Supabase) ────────────────────────
function fallbackGenerate(req: GenerateGiftRequest): GenerateGiftResponse {
  const id = `gift_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const baseBlocks: ContentBlock[] = [
    {
      id: 'intro',
      type: 'text' as const,
      data: {
        heading: getHeading(req),
        body: req.personalMessage || `A special ${req.occasion.replace(/_/g, ' ')} gift for ${req.recipientName}`,
        alignment: 'center' as const,
      },
    },
  ];

  const typeBlocks = getTypeSpecificBlocks(req);

  return {
    success: true,
    gift: {
      id,
      giftType: req.giftType,
      occasion: req.occasion,
      sender: { name: req.senderName },
      recipient: { name: req.recipientName, interests: req.recipientInterests, personalities: req.recipientPersonalities },
      tone: req.tone,
      visualStyle: req.visualStyle,
      contentBlocks: [...baseBlocks, ...typeBlocks],
      assets: [],
      paymentStatus: 'free',
      shareSlug: id,
      personalMessage: req.personalMessage,
      createdAt: new Date().toISOString(),
      metadata: { generatedBy: 'fallback' },
    },
  };
}

function getHeading(req: GenerateGiftRequest): string {
  switch (req.giftType) {
    case 'birthday_card': return `Happy Birthday, ${req.recipientName}! 🎂`;
    case 'invitation': return `You're Invited! 🎉`;
    case 'gift_game': return `${req.recipientName}, a game awaits you! 🎮`;
  }
}

function getTypeSpecificBlocks(req: GenerateGiftRequest): ContentBlock[] {
  switch (req.giftType) {
    case 'birthday_card':
      return [
        { id: 'msg', type: 'text' as const, data: { body: req.personalMessage || 'Wishing you an amazing year ahead!', alignment: 'center' as const } },
        { id: 'cta', type: 'cta' as const, data: { label: 'Share the love', action: 'share' as const } },
      ];
    case 'invitation':
      return [
        {
          id: 'rsvp',
          type: 'rsvp' as const,
          data: {
            eventName: req.occasion.replace(/_/g, ' '),
            eventDate: req.eventDetails?.date ?? new Date().toISOString(),
            eventLocation: req.eventDetails?.location ?? '',
            options: ['Attending', 'Maybe', "Can't make it"],
          },
        },
        { id: 'cta', type: 'cta' as const, data: { label: 'Add to Calendar', action: 'link' as const } },
      ];
    case 'gift_game':
      return [
        {
          id: 'game',
          type: 'quiz_game' as const,
          data: {
            gameType: 'quiz',
            questions: [
              { question: `How well do you know ${req.senderName}?`, options: ['Very well', 'A little', 'Not yet!'], correctAnswer: 0, feedback: 'Great start!' },
              { question: 'What makes this occasion special?', options: ['Memories', 'The people', 'Everything!'], correctAnswer: 2, feedback: '🎉' },
              { question: 'Ready for your surprise?', options: ['Yes!', 'So ready!', 'YESSS!'], correctAnswer: 0, feedback: 'Here it comes!' },
            ],
          },
        },
        { id: 'endmsg', type: 'text' as const, data: { heading: '🎁', body: req.personalMessage || 'You are amazing!', alignment: 'center' as const } },
      ];
  }
}
