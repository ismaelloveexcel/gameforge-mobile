/**
 * GiftForge Types - Personalized Gift Mini-Games
 */

// Questionnaire Response Types
export interface GiftForgeQuestionnaire {
  // Step 1: Occasion
  occasion: GiftOccasion;
  
  // Step 2: Recipient Profile
  recipientAge: AgeRange;
  recipientPersonalities: PersonalityTrait[]; // up to 3
  recipientInterests: Interest[]; // up to 3
  
  // Step 3: Relationship & Tone
  relationship: Relationship;
  tone: Tone;
  
  // Step 4: Game Type & Length
  gameType: GiftGameType;
  gameLength: GameLength;
  
  // Step 5: Visual Style
  visualStyle: GiftVisualStyle;
  
  // Step 6: Personalization
  recipientName: string;
  senderName: string;
  personalMessage: string;
}

export type GiftOccasion = 
  | 'birthday'
  | 'anniversary'
  | 'valentines'
  | 'christmas'
  | 'graduation'
  | 'thank_you'
  | 'get_well'
  | 'congratulations'
  | 'just_because'
  | 'farewell'
  | 'eid_fitr'
  | 'eid_adha'
  | 'uae_national_day'
  | 'mothers_day'
  | 'fathers_day';

export type AgeRange = 
  | 'child' // 5-12
  | 'teen' // 13-17
  | 'young_adult' // 18-25
  | 'adult' // 26-45
  | 'mature_adult' // 46-65
  | 'senior'; // 65+

export type PersonalityTrait = 
  | 'adventurous'
  | 'creative'
  | 'analytical'
  | 'nurturing'
  | 'humorous'
  | 'romantic'
  | 'competitive'
  | 'laid_back'
  | 'energetic'
  | 'thoughtful';

export type Interest = 
  | 'gaming'
  | 'music'
  | 'sports'
  | 'cooking'
  | 'travel'
  | 'reading'
  | 'movies'
  | 'nature'
  | 'technology'
  | 'art'
  | 'fitness'
  | 'animals';

export type Relationship = 
  | 'partner'
  | 'spouse'
  | 'parent'
  | 'child'
  | 'sibling'
  | 'friend'
  | 'colleague'
  | 'grandparent'
  | 'grandchild';

export type Tone = 
  | 'heartfelt'
  | 'playful'
  | 'nostalgic'
  | 'encouraging'
  | 'romantic'
  | 'humorous'
  | 'inspirational';

export type GiftGameType = 
  | 'runner' // Runner-style
  | 'story_choices' // Story & Choices
  | 'puzzle_challenges' // Puzzle & Challenges
  | 'adventure_quest' // Mini Adventure Quest
  | 'educational_playful'; // Educational & Playful

export type GameLength = 
  | 'quick' // 2-3 minutes
  | 'standard' // 5-7 minutes
  | 'extended'; // 10-15 minutes

export type GiftVisualStyle = 
  | 'colorful_cartoon'
  | 'elegant_minimal'
  | 'retro_pixel'
  | 'cozy_handdrawn'
  | 'magical_sparkle';

// Generated Game Output Types
export interface GeneratedGiftGame {
  id: string;
  title: string;
  recipientName: string;
  senderName: string;
  introScreen: IntroScreen;
  endScreen: EndScreen;
  gameContent: GameContent;
  visualStyle: GiftVisualStyle;
  playableUrl?: string;
  createdAt: Date;
}

export interface IntroScreen {
  headline: string;
  subtext: string;
  buttonText: string;
}

export interface EndScreen {
  headline: string;
  personalMessage: string;
  senderSignature: string;
}

export interface GameContent {
  type: GiftGameType;
  dialogue: DialogueItem[];
  mechanics: GameMechanic[];
  levels?: GameLevel[];
  questions?: QuizQuestion[];
  storyBranches?: StoryBranch[];
}

export interface DialogueItem {
  character: string;
  text: string;
  emotion?: 'happy' | 'excited' | 'thoughtful' | 'encouraging' | 'celebrating';
}

export interface GameMechanic {
  type: string;
  description: string;
  parameters: Record<string, any>;
}

export interface GameLevel {
  id: number;
  name: string;
  description: string;
  objectives: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  encouragingFeedback: string;
}

export interface StoryBranch {
  id: string;
  text: string;
  choices: StoryChoice[];
}

export interface StoryChoice {
  text: string;
  nextBranchId: string;
  reaction?: string;
}

// Grok API Types
export interface GrokGameRequest {
  questionnaire: GiftForgeQuestionnaire;
}

export interface GrokGameResponse {
  success: boolean;
  game?: GeneratedGiftGame;
  error?: string;
}

// Wizard/Questionnaire State
export type WizardStep = 
  | 'occasion'
  | 'recipient_profile'
  | 'relationship_tone'
  | 'game_type'
  | 'visual_style'
  | 'personalization'
  | 'confirmation';

export interface WizardState {
  currentStep: WizardStep;
  stepIndex: number;
  totalSteps: number;
  questionnaire: Partial<GiftForgeQuestionnaire>;
  isGenerating: boolean;
  generatedGame?: GeneratedGiftGame;
  error?: string;
}

// Safety Validation Types
export interface SafetyValidationResult {
  isValid: boolean;
  issues: string[];
}

// Display helpers - Premium labels without emojis
export const OCCASION_LABELS: Record<GiftOccasion, string> = {
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  valentines: 'Valentine\'s Day',
  christmas: 'Christmas',
  graduation: 'Graduation',
  thank_you: 'Thank You',
  get_well: 'Get Well Soon',
  congratulations: 'Congratulations',
  just_because: 'Just Because',
  farewell: 'Farewell',
  eid_fitr: 'Eid al-Fitr',
  eid_adha: 'Eid al-Adha',
  uae_national_day: 'UAE National Day',
  mothers_day: 'Mother\'s Day',
  fathers_day: 'Father\'s Day',
};

export const AGE_LABELS: Record<AgeRange, string> = {
  child: 'Child (5-12)',
  teen: 'Teen (13-17)',
  young_adult: 'Young Adult (18-25)',
  adult: 'Adult (26-45)',
  mature_adult: 'Mature Adult (46-65)',
  senior: 'Senior (65+)',
};

export const PERSONALITY_LABELS: Record<PersonalityTrait, string> = {
  adventurous: 'Adventurous',
  creative: 'Creative',
  analytical: 'Analytical',
  nurturing: 'Nurturing',
  humorous: 'Humorous',
  romantic: 'Romantic',
  competitive: 'Competitive',
  laid_back: 'Laid Back',
  energetic: 'Energetic',
  thoughtful: 'Thoughtful',
};

export const INTEREST_LABELS: Record<Interest, string> = {
  gaming: 'Gaming',
  music: 'Music',
  sports: 'Sports',
  cooking: 'Cooking',
  travel: 'Travel',
  reading: 'Reading',
  movies: 'Movies',
  nature: 'Nature',
  technology: 'Technology',
  art: 'Art',
  fitness: 'Fitness',
  animals: 'Animals',
};

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  partner: 'Partner',
  spouse: 'Spouse',
  parent: 'Parent',
  child: 'Child',
  sibling: 'Sibling',
  friend: 'Friend',
  colleague: 'Colleague',
  grandparent: 'Grandparent',
  grandchild: 'Grandchild',
};

export const TONE_LABELS: Record<Tone, string> = {
  heartfelt: 'Heartfelt',
  playful: 'Playful',
  nostalgic: 'Nostalgic',
  encouraging: 'Encouraging',
  romantic: 'Romantic',
  humorous: 'Humorous',
  inspirational: 'Inspirational',
};

export const GAME_TYPE_LABELS: Record<GiftGameType, string> = {
  runner: 'Runner Adventure',
  story_choices: 'Story & Choices',
  puzzle_challenges: 'Puzzle & Challenges',
  adventure_quest: 'Mini Adventure Quest',
  educational_playful: 'Educational & Playful',
};

export const GAME_TYPE_DESCRIPTIONS: Record<GiftGameType, string> = {
  runner: 'A fun side-scrolling adventure collecting themed items',
  story_choices: 'An interactive story with meaningful choices',
  puzzle_challenges: 'Brain teasers and fun challenges',
  adventure_quest: 'A small quest with exploration and surprises',
  educational_playful: 'Learn something new while having fun',
};

export const GAME_LENGTH_LABELS: Record<GameLength, string> = {
  quick: 'Quick (2-3 min)',
  standard: 'Standard (5-7 min)',
  extended: 'Extended (10-15 min)',
};

export const VISUAL_STYLE_LABELS: Record<GiftVisualStyle, string> = {
  colorful_cartoon: 'Colorful Cartoon',
  elegant_minimal: 'Elegant & Minimal',
  retro_pixel: 'Retro Pixel',
  cozy_handdrawn: 'Cozy Hand-drawn',
  magical_sparkle: 'Magical Sparkle',
};
