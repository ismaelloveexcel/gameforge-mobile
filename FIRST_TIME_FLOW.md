# FIRST-TIME FLOW — PlayGift

## The 30-Second Rule

A first-time user MUST experience value within 30 seconds.

```
0-3 seconds:   See ONE dominant action
3-10 seconds:  Tap that action
10-30 seconds: Experience visible progress or delight
```

If any step fails, the UI has failed.

---

## The Hero Moment

### What the User Sees First

**NOT THIS (Generic SaaS):**
```
┌─────────────────────────────────┐
│  PlayGift                       │
│  ─────────────────────────────  │
│  Welcome! Here's what you can   │
│  do with our platform...        │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ A   │ │ B   │ │ C   │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ D   │ │ E   │ │ F   │       │
│  └─────┘ └─────┘ └─────┘       │
└─────────────────────────────────┘
```

**THIS (Focused Experience):**
```
┌─────────────────────────────────┐
│           [Winter Majlis]       │
│    Deep burgundy + gold glow    │
│                                 │
│  ╔═══════════════════════════╗  │
│  ║                           ║  │
│  ║   🎁  Create a Gift      ║  │
│  ║       for Someone         ║  │
│  ║       You Love           ║  │
│  ║                           ║  │
│  ║   [Start Creating →]      ║  │
│  ║                           ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│        "Takes 60 seconds"       │
│                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                 │
│       [More options below]      │
└─────────────────────────────────┘
```

---

## The Hierarchy

### Above the Fold (Visible Without Scrolling)

1. **Hero Card:** 60% of screen height
   - Large, unmissable CTA: "Create a Gift"
   - Compelling subtitle: "For someone you love"
   - Trust signal: "Takes 60 seconds"
   - Seasonal visual treatment (Winter Majlis glow)

2. **Companion:** The Alchemist in corner, waving, contextual greeting

### Below the Fold (Scroll to See)

3. **Quick Actions:** Gift Game, My Projects, Templates
4. **Feature Cards:** For returning users
5. **Stats/Social Proof:** Only after value is clear

---

## The Click-Through

### Step 1: Hero Tap
User taps "Create a Gift" → Full-screen wizard opens

### Step 2: Wizard (5 questions, 60 seconds max)

```
Q1: "Who is this for?"
    [Name input] — Large, friendly, one field

Q2: "What's the occasion?"
    [Birthday] [Anniversary] [Just Because] [Other]
    — Tappable pills, not dropdowns

Q3: "Pick the vibe"
    [Fun & Playful] [Heartfelt] [Nostalgic]
    — Visual cards with previews

Q4: "Your message"
    [Text area] — Pre-filled example, easy to modify

Q5: "Choose game style"
    [Memory] [Puzzle] [Quiz] [Adventure] [Surprise Me]
    — Visual previews of each
```

### Step 3: Generation
- Premium loading animation (5-8 seconds)
- The Alchemist "working magic" animation
- Progress indicators with encouraging messages

### Step 4: Result
- Full preview of the game
- Giant "Share" button
- Platform options: WhatsApp, Instagram, Copy Link
- "Try it yourself" preview button

---

## Copy Guidelines for First-Time

### Hero Copy Options

**Warm (Winter Majlis):**
> "Create a gift they'll actually remember"
> "Takes 60 seconds. Lasts forever."

**Celebratory (Eid):**
> "Make Eid unforgettable"
> "A gift they can play, not just open"

**Energetic (Summer):**
> "Turn any moment into a game"
> "Create something worth sharing"

### Button Copy

- ✅ "Start Creating"
- ✅ "Let's Go"
- ✅ "Create Gift"
- ❌ "Get Started" (generic)
- ❌ "Begin" (cold)
- ❌ "Try Now" (weak)

### Trust Signals

- "Takes 60 seconds"
- "No sign-up required"
- "Free to create"
- "Shareable instantly"

---

## Anti-Patterns to Avoid

### 1. The Feature Dump
❌ Showing all features on home screen
✅ One dominant action, others below fold

### 2. The Welcome Modal
❌ "Welcome to PlayGift! Let us show you around..."
✅ The UI itself is the tutorial

### 3. The Choice Paralysis
❌ "What would you like to do today?"
✅ "Create a gift for someone you love" (TELL them)

### 4. The Empty State
❌ "No projects yet. Create your first project!"
✅ Hero card IS the first action — no empty state visible

### 5. The Sign-Up Wall
❌ Requiring account before value
✅ Create first, sign up to save

---

## Measuring Success

### Key Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Hero tap rate (first session) | ≥60% | — |
| Wizard completion rate | ≥75% | — |
| Time to first share | ≤90 sec | — |
| First-session share rate | ≥40% | — |

### Failure Indicators

- Hero tap rate <40% → Redesign hero
- Wizard abandonment >30% → Simplify wizard
- Time to first share >3 min → Remove friction
- Zero shares first session → Fix share UX

---

## Testing Checklist

Before any release, verify:

- [ ] Hero card is visible without scrolling on iPhone SE
- [ ] Hero CTA is tappable within 3 seconds of app open
- [ ] Wizard completes in under 90 seconds
- [ ] Share button works on all platforms
- [ ] Loading states have premium animation
- [ ] Seasonal theme is correctly applied
- [ ] The Alchemist companion enhances, doesn't distract

---

*First impressions are non-negotiable.*
*If the first 30 seconds don't work, nothing else matters.*
