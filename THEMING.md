# 🌙 THEMING STRATEGY — Seasonal Rotation Engine

## CORE PHILOSOPHY

Themes are **not decoration**.  
Themes are **product positioning**.

A well-executed seasonal theme says:
- "This product knows what month it is"
- "This product respects your cultural context"
- "This product feels fresh, not stale"

**Goal**: Rotate themes every 1-2 months to stay relevant, premium, and culturally aware.

## RAMADAN THEME (LAUNCH DEFAULT)

### When: Feb 28 - Mar 30, 2026

### Positioning
- **Universal, not religious**: Celebrates connection, not worship
- **Inclusive**: For Muslims, expats, non-Muslims celebrating together
- **Premium calm**: Not flashy, not "salesy"
- **Generous spirit**: Gifting is the core message

### Visual Language

#### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Deep Purple** | `#4A148C` | Primary gradient start (dusk prayer time) |
| **Warm Gold** | `#FFD700` | Gradient end (lantern glow) |
| **Soft Lavender** | `#E1BEE7` | Accents, highlights |
| **Dusky Rose** | `#D7A3A3` | Secondary accents |
| **Moonlight White** | `#F5F5F5` | Backgrounds (light mode) |
| **Night Indigo** | `#1A1A2E` | Backgrounds (dark mode) |

#### Gradient Mappings (Time-of-Day)
```typescript
// Ramadan-specific overrides in LivingGradient.tsx
const ramadanGradients = {
  dawn:      ['#4A148C', '#D7A3A3'], // Pre-dawn (suhoor)
  morning:   ['#E1BEE7', '#FFD700'], // Post-sunrise
  afternoon: ['#FFD700', '#FFA500'], // Daylight fasting
  evening:   ['#FF6B6B', '#4A148C'], // Iftar (sunset)
  night:     ['#4A148C', '#1A1A2E'], // Tarawih (night prayer)
  midnight:  ['#1A1A2E', '#2E2E3E'], // Late night reflection
};
```

#### Motifs & Icons
- **Crescent moon**: Header logo or top-right corner
- **Lanterns**: Subtle particle effects (not overwhelming)
- **Stars**: Background sparkles (activated on tap/hover)
- **Geometric patterns**: Subtle tile patterns in cards (Islamic art-inspired, not literal)

#### Typography
- **Headings**: Keep sans-serif (Poppins), but increase weight for premium feel
- **Body text**: Slightly larger (16px base) for comfort
- **Accent text**: Gold color for CTAs ("Create a Gift Game")

#### Motion & Timing
- **Slower animations**: Extend spring duration by 20% (calm, reflective)
- **Gentle entrance**: FadeIn with soft opacity (no harsh pops)
- **Celebration toned down**: Replace confetti with soft stars (less chaotic)

### Copy Guidelines

#### Universal Language (NOT Religious-Specific)
| Avoid | Use Instead |
|-------|-------------|
| "Holy month" | "Season of giving" |
| "Fast with us" | "Connect with loved ones" |
| "Islamic theme" | "Cultural celebration" |
| "Prayer times" | "Moments of reflection" |

#### Recommended Phrases
- "Create a gift to celebrate connection"
- "Share a moment of joy"
- "Made with love, shared with care"
- "Celebrate the season of generosity"

#### Button Text
- **Primary CTA**: "Create a Gift Game" (unchanged)
- **Secondary CTA**: "Share Your Creation"
- **Onboarding**: "Start Your Gift"

### What Changes (Technically)

#### Files to Update
1. **`/src/design-tokens/theme.ts`**
   - Add `ramadanPalette` to theme object
   - Set `activeTheme: 'ramadan'` (can be config-driven)

2. **`/src/components/LivingGradient.tsx`**
   - Add `ramadanGradients` mapping
   - Check `activeTheme` from context and apply appropriate gradients

3. **`/src/contexts/ThemeContext.tsx`** (if exists, else create)
   - Track current theme (`ramadan`, `eid`, `summer`, etc.)
   - Provide `getActiveTheme()` helper

4. **`/src/screens/HomeScreenNew.tsx`**
   - Update greeting text: "Season's greetings" → context-aware
   - Show crescent icon in header (conditional)

5. **`/src/components/ParticleField.tsx`**
   - Swap confetti particles for soft stars (Ramadan mode)

#### Assets Needed
- `crescent-icon.svg` (24x24, gold color)
- `lantern-icon.svg` (optional, for empty states)
- `star-particle.png` (8x8, soft glow)

### What Stays The Same
- **Core UX flow**: Wizard, questions, preview, share (unchanged)
- **Dodo personality**: Still friendly, still cute (no outfit change needed for v1)
- **Core colors**: Brand blue (`#003087`) still appears in logos, nav

---

## EID AL-FITR THEME (POST-RAMADAN)

### When: Mar 30 - Apr 15, 2026

### Positioning
- **Celebratory**: End of fasting, joyful reunion
- **Family-focused**: Gifting for kids, elders, friends
- **Bright & warm**: More colorful than Ramadan (less restraint)

### Visual Language

#### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Bright Teal** | `#00BCD4` | Primary gradient |
| **Sunny Yellow** | `#FFC107` | Gradient end, accents |
| **Coral Pink** | `#FF6F91` | Highlights, CTAs |
| **Mint Green** | `#A8E6CF` | Secondary accents |
| **Pure White** | `#FFFFFF` | Backgrounds (light mode) |
| **Soft Navy** | `#2C3E50` | Backgrounds (dark mode) |

#### Motifs
- **Balloons**: Floating particle effects
- **Confetti**: Re-enable full confetti on achievements
- **Fireworks**: Optional celebration overlay (on share)

#### Copy
- "Celebrate the joy!"
- "Eid Mubarak! Share a gift game"
- "Made for moments of happiness"

---

## SUMMER THEME (VACATION SEASON)

### When: May - August 2026

### Positioning
- **Playful & energetic**: School's out, vacation mode
- **Beach vibes**: Sun, sand, fun (not literal beach imagery)
- **Graduation gifting**: Peak season for grad celebrations

### Visual Language

#### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Ocean Blue** | `#0077BE` | Primary gradient |
| **Sunset Orange** | `#FF7F50` | Gradient end |
| **Lime Green** | `#7FFF00` | Accents |
| **Sand Beige** | `#F5DEB3` | Neutral backgrounds |
| **Bright White** | `#FFFFFF` | Cards, highlights |
| **Deep Blue** | `#003366` | Dark mode base |

#### Motifs
- **Sunburst**: Radial glow effects
- **Waves**: Subtle animated background patterns
- **Beach balls**: Particle replacements (optional)

#### Copy
- "Create a summer surprise"
- "Send a gift to brighten their day"
- "Celebrate the season of fun"

---

## UAE NATIONAL DAY THEME

### When: December 1-7, 2026

### Positioning
- **Proud & unified**: Celebrate UAE heritage
- **Inclusive**: For all residents (citizens + expats)
- **Premium patriotic**: Not tacky flags everywhere

### Visual Language

#### Color Palette (UAE Flag Colors)
| Color | Hex | Usage |
|-------|-----|-------|
| **Red** | `#FF0000` | Primary accent |
| **Green** | `#00732F` | Secondary accent |
| **White** | `#FFFFFF` | Backgrounds, text |
| **Black** | `#000000` | Dark mode base |
| **Gold** | `#FFD700` | Premium highlights |

#### Motifs
- **Falcon**: Subtle outline in header (UAE symbol)
- **UAE skyline**: Minimalist line art (optional background)
- **Stars**: Representing the 7 emirates

#### Copy
- "Celebrate 55 years of pride"
- "Create a gift to honor our unity"
- "Made in the UAE, for the UAE"

---

## WINTER THEME (DECEMBER - FEBRUARY)

### When: December 15 - February 27, 2027

### Positioning
- **Cozy & reflective**: End of year, new beginnings
- **Inclusive holidays**: Christmas, New Year, but not exclusively
- **Cool & calm**: Contrast to summer energy

### Visual Language

#### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **Icy Blue** | `#A8D8EA` | Primary gradient |
| **Soft Silver** | `#C0C0C0` | Gradient end |
| **Lavender** | `#B19CD9` | Accents |
| **Snowy White** | `#F8F8FF` | Backgrounds (light) |
| **Charcoal** | `#36454F` | Dark mode base |

#### Motifs
- **Snowflakes**: Falling particles (subtle, not heavy)
- **Frost patterns**: Edges of cards (delicate)
- **Starlight**: Twinkling background stars

#### Copy
- "Celebrate the season of reflection"
- "Create a gift to warm hearts"
- "Made for moments that matter"

---

## THEME ROTATION LOGIC

### How Themes Are Activated

#### 1. Date-Based Auto-Switch (Recommended)
```typescript
// /src/contexts/ThemeContext.tsx
const getActiveTheme = (): ThemeName => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Ramadan (Feb 28 - Mar 30)
  if ((month === 2 && day >= 28) || (month === 3 && day <= 30)) {
    return 'ramadan';
  }

  // Eid (Mar 30 - Apr 15)
  if ((month === 3 && day > 30) || (month === 4 && day <= 15)) {
    return 'eid';
  }

  // Summer (May - Aug)
  if (month >= 5 && month <= 8) {
    return 'summer';
  }

  // National Day (Dec 1-7)
  if (month === 12 && day >= 1 && day <= 7) {
    return 'national-day';
  }

  // Winter (Dec 15 - Feb 27)
  if ((month === 12 && day >= 15) || month === 1 || (month === 2 && day < 28)) {
    return 'winter';
  }

  // Default (fallback)
  return 'default';
};
```

#### 2. Remote Config Override (For Flexibility)
Use Firebase Remote Config or similar to override dates:
```json
{
  "activeTheme": "ramadan",
  "themeStartDate": "2026-02-28",
  "themeEndDate": "2026-03-30"
}
```

**Benefit**: Can adjust theme dates without app update (e.g., if Ramadan dates shift).

### Testing Themes
```typescript
// For dev/testing only
const FORCE_THEME = process.env.FORCE_THEME; // e.g., "ramadan", "eid"
const theme = FORCE_THEME || getActiveTheme();
```

---

## DESIGN PRINCIPLES (APPLY TO ALL THEMES)

### 1. Subtle, Not Overwhelming
- **Gradients**: Smooth transitions, not harsh stops
- **Motifs**: Accent pieces, not wallpaper
- **Animations**: Gentle, not distracting

### 2. Culturally Aware, Not Stereotypical
- **Do**: Use color psychology, subtle iconography
- **Don't**: Literal religious symbols, cliché imagery

### 3. Premium Feel
- **Do**: Smooth animations, thoughtful spacing, quality assets
- **Don't**: Stock photos, clipart, generic icons

### 4. Accessibility Always
- **Color contrast**: All text meets WCAG AA (4.5:1 minimum)
- **Motion**: Respect `prefers-reduced-motion` for all animations
- **Dark mode**: Every theme has a dark mode variant

### 5. Performance First
- **Gradients**: CSS gradients (not images) for web
- **Particles**: Canvas-based, max 50 particles on mobile
- **Animations**: Use `react-native-reanimated` (runs on UI thread)

---

## CHECKLIST FOR NEW THEME

When adding a new seasonal theme:

- [ ] Define color palette (6 colors minimum: 2 gradients, 2 accents, 2 backgrounds)
- [ ] Map time-of-day gradients (6 periods: dawn, morning, afternoon, evening, night, midnight)
- [ ] Design 2-3 motifs (icons, particles, patterns)
- [ ] Write cultural positioning statement (2-3 sentences)
- [ ] Draft copy guidelines (3-5 phrases)
- [ ] Update `theme.ts` with new palette
- [ ] Update `LivingGradient.tsx` with gradient mappings
- [ ] Update `ThemeContext.tsx` date logic
- [ ] Test in both light and dark modes
- [ ] Test on iOS, Android, Web
- [ ] Validate accessibility (color contrast, motion)
- [ ] Ship 2 weeks before theme start date (buffer for bugs)

---

## WHY THIS MATTERS

### Product Impact
- **First impressions**: Users see a product that "gets it" immediately
- **Retention**: App feels fresh every 1-2 months (less abandonment)
- **Cultural fit**: UAE users see a product built for them, not "localized" afterthought

### Business Impact
- **Virality**: Themed gifting moments = more shares ("Check out this Ramadan game!")
- **Seasonality**: Higher engagement during cultural peaks (Ramadan, Eid, National Day)
- **Premium positioning**: Regular theme updates signal quality and care

### Engineering Impact
- **Maintainable**: Themes are config, not code (minimal technical debt)
- **Scalable**: New themes don't require full releases (remote config FTW)
- **Reusable**: Theme system applies to future markets (Diwali for India, Lunar New Year for Asia)

---

## FINAL GUARDRAIL

> **"Cultural ≠ Religious"**

Themes celebrate **shared cultural moments**, not religious observances.

- **Ramadan theme**: About generosity and connection (universal), not fasting or prayer (specific)
- **National Day theme**: About pride and unity (inclusive), not citizenship (exclusive)
- **Winter theme**: About reflection and warmth (neutral), not Christmas (specific)

**Test**: Would a non-Muslim expat in Dubai feel welcome using the Ramadan theme?  
If no → Redesign it.

---

*Themes are strategy, not decoration. Execute with cultural intelligence.* 🌙
