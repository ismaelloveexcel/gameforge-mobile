# THEMING SYSTEM — GameForge Mobile

## Seasonal Theme Calendar (UAE)

The app AUTOMATICALLY applies themes based on the current date. No user configuration required.

**⚠️ IMPORTANT:** Hardcoded dates work for 2026 only. Ramadan/Eid shift ~10-11 days annually due to lunar calendar. **Production MUST use remote config or Islamic calendar library** (e.g., `hijri-date`, `moment-hijri`).

### Active Theme Logic

```typescript
// Type definitions
type SeasonalTheme = 'eternal-romance' | 'nocturnal-revival' | 'golden-reunion' | 
                     'neon-dubai-summer' | 'autumn-harvest' | 'uae-pride' | 
                     'winter-majlis' | 'creator-wave';

/**
 * Get the active seasonal theme based on current date
 * @returns {SeasonalTheme} - Active theme name
 * 
 * ⚠️ WARNING: This implementation uses hardcoded 2026 dates
 * Production should use:
 * 1. Remote config for Ramadan/Eid dates (updates without app release)
 * 2. Islamic calendar library for accurate lunar date calculations
 * 3. Fallback to these static dates if remote config fails
 */
function getActiveTheme(): SeasonalTheme {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  
  // Valentine's / Eternal Romance (Feb 1-14)
  if (month === 2 && day >= 1 && day <= 14) {
    return 'eternal-romance';
  }
  
  // Ramadan 2026 (Feb 18 - Mar 19, subject to moon sighting)
  // ⚠️ 2027 dates will be ~Feb 7 - Mar 8 (update annually!)
  if ((month === 2 && day >= 18) || (month === 3 && day <= 19)) {
    return 'nocturnal-revival';
  }
  
  // Eid al-Fitr 2026 (Mar 20-25, ~1-3 day celebration)
  if (month === 3 && day >= 20 && day <= 25) {
    return 'golden-reunion';
  }
  
  // Summer (May - August)
  if (month >= 5 && month <= 8) {
    return 'neon-dubai-summer';
  }
  
  // Autumn Harvest (Sep - Nov 29)
  if (month >= 9 && month < 11 || (month === 11 && day < 30)) {
    return 'autumn-harvest';
  }
  
  // UAE National Day (Nov 30 - Dec 3)
  if ((month === 11 && day >= 30) || (month === 12 && day <= 3)) {
    return 'uae-pride';
  }
  
  // Winter Majlis (Dec 4 - Jan 31)
  if (month === 12 && day >= 4 || month === 1) {
    return 'winter-majlis';
  }
  
  // Default: Creator Wave (fills remaining gaps: Mar 26 - Apr 30, Feb 15-17)
  return 'creator-wave';
}
```

---

## Theme Definitions

### 1. Eternal Romance (February 1-14)
**Current Active Theme (February 2026) — Valentine's Season**

**Mood:** Deep passion, sophisticated love, intimate connection

**Visual Description:**
- Rich reds and deep burgundies with rose gold accents
- Velvet textures, silk ribbons, premium romantic aesthetics
- Soft bokeh lights like candlelight dinners
- Heart motifs (subtle, elegant, not childish)
- Luxurious, not saccharine

**Color Palette:**
```
Primary:     #8B0000 (Deep Romantic Red)
Secondary:   #C9A186 (Rose Gold)
Accent:      #FFB6C1 (Soft Rose)
Background:  #1A0F0F (Deep Wine)
Surface:     #2A1A1A (Burgundy Black)
Text:        #FFF5F5 (Soft White)
Muted:       #9A7A7A (Dusty Rose)
```

**Gradient:**
`linear-gradient(145deg, #8B0000 0%, #2A1A1A 50%, #1A0F0F 100%)`

**Hero Accent:** Rose gold shimmer, soft romantic glow

**Copy Examples:**
- "Create a gift they'll treasure forever"
- "For the one who means everything"
- "More than words. A moment they can hold."

---

### 2. Winter Majlis (December 4 - January 31)
**Winter Season Theme**

**Mood:** Cozy gatherings, intimate luxury, warmth against cool evenings

**Visual Description:**
- Deep jewel tones: burgundy, emerald, sapphire
- Warm gold accents reminiscent of Arabic coffee pots (dallah)
- Rich textures suggesting velvet, wool, warm textiles
- Soft, warm lighting like lanterns in a majlis
- Intimate, enclosed feeling

**Color Palette:**
```
Primary:     #6B2D5B (Deep Burgundy)
Secondary:   #1A5F4A (Forest Emerald)
Accent:      #D4AF37 (Arabic Gold)
Background:  #1C1820 (Warm Charcoal)
Surface:     #2A2530 (Soft Plum Black)
Text:        #F5EDE6 (Warm Cream)
Muted:       #9A8F94 (Dusty Mauve)
```

**Gradient:**
`linear-gradient(145deg, #2A2530 0%, #1C1820 50%, #1A1A2E 100%)`

**Hero Accent:** Glowing gold border, like candlelight

**Thumbnail Preview Description:**
A cozy indoor scene with rich burgundy cushions, gold-trimmed coffee cups, warm amber lighting, and emerald accents — the essence of a winter evening majlis gathering.

---

### 2. Nocturnal Revival (Ramadan)
**2026 Dates: ~February 18 - March 19** (subject to moon sighting)  
**⚠️ 2027 Dates: ~February 7 - March 8** (shifts ~10-11 days annually)

**Mood:** Calm energy, spiritual warmth, late-night creativity

**Visual Description:**
- Deep midnight blues and purples
- Crescent moon motifs (subtle, not literal)
- Warm lantern-like amber accents
- Stars and soft glows
- Tranquil yet awake feeling

**Color Palette:**
```
Primary:     #4A3F6B (Midnight Purple)
Secondary:   #F4B942 (Lantern Gold)
Accent:      #7FDBDA (Moonlight Teal)
Background:  #0D0D1A (Deep Night)
Surface:     #1A1A2E (Night Sky)
Text:        #F5F5F5 (Moonlight White)
Muted:       #7A7A8C (Dusk Grey)
```

**Hero Accent:** Soft amber glow, crescent-inspired curves

---

### 3. Golden Reunion (Eid)
**2026 Dates: ~March 20-25** (1-3 day celebration after Ramadan)  
**⚠️ 2027 Dates: ~March 9-14** (shifts with Ramadan)

**Mood:** Celebration, reunion, premium joy, optimism

**Visual Description:**
- Rich golds and warm whites
- Festive without being gaudy
- Confetti-like sparkles
- Gift and celebration imagery
- Joyful, generous feeling

**Color Palette:**
```
Primary:     #D4AF37 (Pure Gold)
Secondary:   #FFFFFF (Clean White)
Accent:      #E8C4A2 (Soft Peach)
Background:  #FFFEF5 (Warm White)
Surface:     #FFF8E7 (Cream)
Text:        #2C2416 (Rich Brown)
Muted:       #A89F8F (Warm Grey)
```

**Hero Accent:** Golden shimmer, subtle sparkle animations

---

### 4. Neon Dubai Summer (May - August)

**Mood:** Bold nightlife, poolside energy, unapologetic glamour

**Visual Description:**
- Electric neons: cyan, magenta, yellow
- Dark backgrounds with neon pops
- Nightclub/pool party energy
- Modern, edgy, youthful
- Beach and skyline imagery

**Color Palette:**
```
Primary:     #00FFFF (Electric Cyan)
Secondary:   #FF00FF (Hot Magenta)
Accent:      #FFFF00 (Neon Yellow)
Background:  #0A0A0F (Deep Black)
Surface:     #15151F (Charcoal)
Text:        #FFFFFF (Pure White)
Muted:       #6B6B7B (Cool Grey)
```

**Hero Accent:** Neon glow effects, pulsing animations

---

### 5. Autumn Harvest (September - November 29)

**Mood:** Transition, preparation, cozy gatherings before winter

**Visual Description:**
- Warm oranges, burnt siennas, golden browns
- Harvest and abundance imagery
- Comfortable, grounded aesthetics
- Natural textures
- Fills the gap between Summer and National Day

**Color Palette:**
```
Primary:     #CC5500 (Burnt Orange)
Secondary:   #8B4513 (Saddle Brown)
Accent:      #DAA520 (Goldenrod)
Background:  #1A1410 (Dark Earth)
Surface:     #2A201A (Warm Brown)
Text:        #F5EDE0 (Cream)
Muted:       #8A7A6A (Warm Grey)
```

**Hero Accent:** Golden warmth, harvest glow

---

### 6. UAE Pride (November 30 - December 3)
**UAE National Day — December 2, 1971**

**Mood:** Patriotic, unified, proud, hopeful

**Visual Description:**
- UAE flag colors: red, green, white, black
- Modern interpretation, not literal flags
- Geometric patterns inspired by UAE architecture
- Falcon and desert motifs (subtle)
- Celebration of heritage and progress

**Color Palette:**
```
Primary:     #FF0000 (UAE Red)
Secondary:   #00732F (UAE Green)
Accent:      #FFFFFF (Pure White)
Background:  #111111 (UAE Black)
Surface:     #1A1A1A (Soft Black)
Text:        #FFFFFF (White)
Muted:       #888888 (Grey)
```

**Copy Examples:**
- "Celebrate UAE heritage and unity"
- "Gifts that honor our past, embrace our future"
- "United in creativity"

---

### 7. Creator Wave (Default)
**Active: March 26 - April 30, February 15-17** (fills gaps)

**Mood:** Aspirational, creative, maximalist luxury

**Visual Description:**
- Rich purples and warm golds
- Creative energy without specific seasonality
- Premium but approachable
- Inspires creation

**Color Palette:**
```
Primary:     #6366F1 (Forge Purple)
Secondary:   #EC4899 (Spark Pink)
Accent:      #F59E0B (Creator Gold)
Background:  #0C0A09 (Warm Black)
Surface:     #1C1917 (Stone)
Text:        #FAFAF9 (Cream)
Muted:       #78716C (Stone Grey)
```

---

## Implementation Notes

### Theme Token Structure
```typescript
type SeasonalTheme = 'eternal-romance' | 'nocturnal-revival' | 'golden-reunion' | 
                     'neon-dubai-summer' | 'autumn-harvest' | 'uae-pride' | 
                     'winter-majlis' | 'creator-wave';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

interface SeasonalThemeConfig {
  id: SeasonalTheme;
  name: string;
  mood: string;
  colors: ThemeColors;
  gradient: string[];
  heroGlow: string;
}
```

### Dark Mode Behavior
All seasonal themes are designed as dark-first. Light mode variants should:
- Invert background/text
- Reduce glow intensity
- Maintain accent colors

### Animation Adjustments per Theme
- **Eternal Romance:** Slow, smooth, heartbeat rhythm
- **Winter Majlis:** Slow, gentle, cozy
- **Nocturnal Revival:** Calm, breathing, peaceful
- **Golden Reunion:** Celebratory, sparkly, joyful
- **Neon Dubai Summer:** Fast, pulsing, energetic
- **Autumn Harvest:** Steady, warm, grounded
- **UAE Pride:** Proud, rhythmic, unified
- **Creator Wave:** Creative, flowing, inspiring

---

## 2026 Theme Calendar (Quick Reference)

| Dates | Theme | Notes |
|-------|-------|-------|
| Feb 1-14 | **Eternal Romance** | Valentine's season |
| Feb 15-17 | Creator Wave | Transition |
| Feb 18 - Mar 19 | **Nocturnal Revival** | Ramadan 2026 (verify moon sighting) |
| Mar 20-25 | **Golden Reunion** | Eid al-Fitr |
| Mar 26 - Apr 30 | Creator Wave | Spring transition |
| May - Aug | **Neon Dubai Summer** | Peak summer |
| Sep - Nov 29 | **Autumn Harvest** | Fall season |
| Nov 30 - Dec 3 | **UAE Pride** | National Day |
| Dec 4 - Jan 31 | **Winter Majlis** | Winter season |

**⚠️ PRODUCTION REQUIREMENT:**
- Use remote config for Ramadan/Eid dates (lunar calendar shifts annually)
- Consider Islamic calendar library: `hijri-date`, `moment-hijri`, or API service
- These hardcoded dates are 2026-specific fallbacks only

---

*Themes are applied automatically. No configuration required.*  
*Active Theme (Feb 1, 2026): **Eternal Romance***
