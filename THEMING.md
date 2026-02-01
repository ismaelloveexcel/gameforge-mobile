# THEMING SYSTEM — GameForge Mobile

## Seasonal Theme Calendar (UAE)

The app AUTOMATICALLY applies themes based on the current date. No user configuration required.

### Active Theme Logic

```typescript
function getActiveTheme(): SeasonalTheme {
  const month = new Date().getMonth() + 1; // 1-12
  const day = new Date().getDate();
  
  // Ramadan (approximate - should use Hijri calendar)
  // For 2026: ~Feb 18 - Mar 19
  if ((month === 2 && day >= 18) || (month === 3 && day <= 19)) {
    return 'nocturnal-revival';
  }
  
  // Eid al-Fitr (3 days after Ramadan)
  if (month === 3 && day >= 20 && day <= 25) {
    return 'golden-reunion';
  }
  
  // UAE National Day (Nov 30 - Dec 3)
  if ((month === 11 && day >= 30) || (month === 12 && day <= 3)) {
    return 'uae-pride';
  }
  
  // Winter (November - February)
  if (month >= 11 || month <= 2) {
    return 'winter-majlis';
  }
  
  // Summer (June - August)
  if (month >= 6 && month <= 8) {
    return 'neon-dubai-summer';
  }
  
  // Default: Creator Wave
  return 'creator-wave';
}
```

---

## Theme Definitions

### 1. Winter Majlis (November - February)
**Current Active Theme (January 2026)**

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

### 4. Neon Dubai Summer (June - August)

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

### 5. UAE Pride (National Day)

**Mood:** Patriotic, unified, proud, hopeful

**Visual Description:**
- UAE flag colors: red, green, white, black
- Modern interpretation, not literal flags
- Geometric patterns inspired by UAE architecture
- Falcon and desert motifs (subtle)

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

---

### 6. Creator Wave (Default)

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
interface SeasonalTheme {
  id: string;
  name: string;
  mood: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
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
- **Winter Majlis:** Slow, gentle, cozy
- **Nocturnal Revival:** Calm, breathing, peaceful
- **Golden Reunion:** Celebratory, sparkly, joyful
- **Neon Dubai Summer:** Fast, pulsing, energetic
- **UAE Pride:** Proud, rhythmic, unified
- **Creator Wave:** Creative, flowing, inspiring

---

*Themes are applied automatically. No configuration required.*
*Active: Winter Majlis (January 2026)*
