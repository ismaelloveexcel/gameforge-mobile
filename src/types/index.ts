// ─── GiftVerse Navigation Types ────────────────────────────────
export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Home: undefined;
  History: undefined;
  Settings: undefined;
  GiftWizard: { giftType?: GiftType } | undefined;
  GiftPreview: { giftId: string };
  GiftView: { giftId: string };
};

// ─── Gift Types ────────────────────────────────────────────
export type GiftType = 'gift_game' | 'birthday_card' | 'invitation';

export type GiftOccasion =
  | 'birthday' | 'anniversary' | 'valentines' | 'christmas'
  | 'graduation' | 'thank_you' | 'get_well' | 'congratulations'
  | 'just_because' | 'farewell' | 'eid_fitr' | 'eid_adha'
  | 'uae_national_day' | 'mothers_day' | 'fathers_day'
  | 'wedding' | 'baby_shower' | 'housewarming';

export type Tone =
  | 'heartfelt' | 'playful' | 'nostalgic' | 'encouraging'
  | 'romantic' | 'humorous' | 'inspirational' | 'formal';

export type VisualStyle =
  | 'colorful_cartoon' | 'elegant_minimal' | 'retro_pixel'
  | 'cozy_handdrawn' | 'magical_sparkle';

export type PaymentStatus = 'free' | 'pending' | 'paid' | 'failed';

// ─── Content Blocks ────────────────────────────────────────
export type ContentBlockType = 'text' | 'media' | 'cta' | 'rsvp' | 'quiz_game' | 'countdown';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  data: TextBlockData | MediaBlockData | CTABlockData | RSVPBlockData | QuizGameBlockData | CountdownBlockData;
}

export interface TextBlockData {
  heading?: string;
  body: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface MediaBlockData {
  uri: string;
  mediaType: 'image' | 'video' | 'audio';
  caption?: string;
}

export interface CTABlockData {
  label: string;
  action: 'link' | 'share' | 'rsvp' | 'redeem';
  url?: string;
}

export interface RSVPBlockData {
  eventName: string;
  eventDate: string;
  eventLocation?: string;
  options: string[];
}

export interface QuizGameBlockData {
  questions: QuizQuestion[];
  gameType: 'quiz' | 'story_choices' | 'puzzle' | 'runner';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  feedback: string;
}

export interface CountdownBlockData {
  targetDate: string;
  label: string;
}

// ─── GiftExperience (unified model) ─────────────────────────
export interface GiftExperience {
  id: string;
  giftType: GiftType;
  occasion: GiftOccasion;
  sender: { name: string; email?: string };
  recipient: { name: string; age?: string; interests?: string[]; personalities?: string[] };
  tone: Tone;
  visualStyle: VisualStyle;
  contentBlocks: ContentBlock[];
  assets: GiftAsset[];
  paymentStatus: PaymentStatus;
  shareSlug: string;
  shareUrl?: string;
  personalMessage: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface GiftAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'lottie';
  uri: string;
}

// ─── Wizard State ──────────────────────────────────────────
export type WizardStep = 'gift_type' | 'occasion' | 'recipient' | 'tone_style' | 'content' | 'confirmation';

export interface WizardState {
  currentStep: WizardStep;
  stepIndex: number;
  draft: Partial<GiftExperience>;
  isGenerating: boolean;
  error?: string;
}

// ─── Display Labels ────────────────────────────────────────
export const GIFT_TYPE_LABELS: Record<GiftType, { label: string; icon: string; description: string }> = {
  gift_game: { label: 'Gift Game', icon: 'gamepad-variant', description: 'An interactive mini-game gift' },
  birthday_card: { label: 'Birthday Card', icon: 'card-text', description: 'A beautiful digital birthday card' },
  invitation: { label: 'Invitation', icon: 'email-heart-outline', description: 'An event invitation with RSVP' },
};

export const OCCASION_LABELS: Record<GiftOccasion, string> = {
  birthday: 'Birthday', anniversary: 'Anniversary', valentines: "Valentine's Day",
  christmas: 'Christmas', graduation: 'Graduation', thank_you: 'Thank You',
  get_well: 'Get Well Soon', congratulations: 'Congratulations', just_because: 'Just Because',
  farewell: 'Farewell', eid_fitr: 'Eid al-Fitr', eid_adha: 'Eid al-Adha',
  uae_national_day: 'UAE National Day', mothers_day: "Mother's Day", fathers_day: "Father's Day",
  wedding: 'Wedding', baby_shower: 'Baby Shower', housewarming: 'Housewarming',
};

export const TONE_LABELS: Record<Tone, string> = {
  heartfelt: 'Heartfelt', playful: 'Playful', nostalgic: 'Nostalgic',
  encouraging: 'Encouraging', romantic: 'Romantic', humorous: 'Humorous',
  inspirational: 'Inspirational', formal: 'Formal',
};

export const VISUAL_STYLE_LABELS: Record<VisualStyle, string> = {
  colorful_cartoon: 'Colorful Cartoon', elegant_minimal: 'Elegant & Minimal',
  retro_pixel: 'Retro Pixel', cozy_handdrawn: 'Cozy Hand-Drawn', magical_sparkle: 'Magical Sparkle',
};
