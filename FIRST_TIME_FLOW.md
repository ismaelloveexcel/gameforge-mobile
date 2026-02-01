# 🎯 FIRST-TIME FLOW — Sacred Guardrails

## THE GOLDEN RULE

> **"First-time users see ONE thing, do ONE thing, and feel confident doing it."**

Everything else—templates, tabs, settings, assistant—comes **after** they've experienced success.

## WHY THIS MATTERS

### The 5-Second Test
When a first-time user opens the app, they should know **exactly** what to do within 5 seconds.

**Passing the test:**
- ✅ Clear single CTA: "Create a Gift Game"
- ✅ No competing options (tabs, menus, suggestions)
- ✅ Dodo greeting with one-line explanation

**Failing the test:**
- ❌ Multiple tabs: "Create", "Templates", "Projects"
- ❌ Assistant popping up: "How can I help you?"
- ❌ Empty state: "Welcome! Explore our features..."

### The 30-Second Preview
Within 30 seconds of tapping "Create a Gift Game", users should see **something real**.

**Success criteria:**
- Wizard shows first question immediately (no loading screen)
- Progress bar shows they're 1/6 done (not overwhelming)
- AI generates preview during wizard (not after)

**Why?** Confidence is built through action, not reading.

---

## FIRST-SESSION LOCKING RULES

### What First-Time Users See

#### Home Screen (Initial State)
```
┌─────────────────────────────────┐
│  🦤 Dodo waves                  │
│  "Create a gift game in 2 mins" │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Create a Gift Game 🎁  │   │ ← PRIMARY CTA (only action)
│  └─────────────────────────┘   │
│                                 │
│  [No tabs visible]              │
│  [No "Templates" link]          │
│  [No "Assistant" button]        │
└─────────────────────────────────┘
```

**Rationale:**
- **One choice = no confusion**: User doesn't have to "figure out" the app
- **Clear purpose**: "This app makes gift games"
- **Action-first**: No browsing, no exploring, just create

### What's Hidden (Until After First Preview)

| Feature | Hidden? | Why |
|---------|---------|-----|
| **"Your Games" tab** | ✅ Hidden | No games yet, so why show it? |
| **"Templates" tab** | ✅ Hidden | Templates = browsing mode (wrong mindset) |
| **"Dodo Assistant"** | ✅ Hidden | Assistant = asking for help (but user hasn't tried yet) |
| **Settings** | ✅ Hidden | Not relevant until they're invested |
| **"How It Works"** | ✅ Hidden | No tutorials, just do it |

**Exception:** If user force-quits and reopens, keep hiding until first game preview is complete.

---

## THE WIZARD FLOW (STEP-BY-STEP)

### Step 1: Occasion
**Question:** "What's the occasion?"

**Options (6 chips):**
- 🎂 Birthday
- ❤️ Anniversary
- 💝 Valentine's Day
- 🎓 Graduation
- 🎉 Just Because
- 🌙 Seasonal (Ramadan/Eid/etc., auto-selected if in-season)

**UI:**
- Single-select chips (not dropdown)
- Progress bar: 1/6 complete
- Dodo mood: `curious`
- Background: Living gradient (time-aware)

**Next:** Tap chip → Auto-advance to Step 2 (no "Next" button)

---

### Step 2: Recipient
**Question:** "Tell me about them"

**Inputs:**
- Name (text field, required)
- Age (number picker, optional)
- 3 personality traits (multi-select chips)

**Traits:**
- Funny, Kind, Creative, Adventurous, Thoughtful, Energetic, Calm, Smart

**UI:**
- Progress bar: 2/6 complete
- Dodo mood: `thinking`
- "Skip" button for age (not everyone wants to specify)

**Next:** Tap "Continue" (enabled after name is filled)

---

### Step 3: Relationship & Tone
**Question:** "What's your vibe?"

**Options (single-select):**
- 💖 Romantic (partner, spouse)
- 😄 Playful (friend, sibling)
- 💕 Heartfelt (parent, best friend)
- 🎉 Celebratory (colleague, acquaintance)

**UI:**
- Progress bar: 3/6 complete
- Dodo mood: `excited`
- Each option shows example line: "You make my heart race!" (romantic)

**Next:** Tap option → Auto-advance

---

### Step 4: Game Type
**Question:** "Pick a game style"

**Options (5 cards with icons):**
- 🏃 Runner Adventure
- 📖 Story & Choices
- 🧩 Puzzle & Challenges
- 🗺️ Mini Adventure Quest
- 🎓 Educational & Playful

**UI:**
- Progress bar: 4/6 complete
- Dodo mood: `curious`
- Cards show 1-sentence description
- No "View All Templates" (that's for later)

**Next:** Tap card → Auto-advance

---

### Step 5: Visual Style
**Question:** "Choose a look"

**Options (6 style chips with color swatches):**
- 🎨 Colorful Cartoon
- ✨ Elegant Minimal
- 🕹️ Retro Pixel
- 🌊 Soft Watercolor
- 🌌 Cosmic Neon
- 🌿 Nature Tones

**UI:**
- Progress bar: 5/6 complete
- Dodo mood: `happy`
- Each chip shows color palette preview

**Next:** Tap chip → Auto-advance

---

### Step 6: Personal Touches
**Question:** "Add your magic"

**Inputs:**
- Your name (text field, optional)
- A message to recipient (text area, 3 lines max)
- Optional: Add a photo (not v1, placeholder for future)

**UI:**
- Progress bar: 6/6 complete
- Dodo mood: `excited`
- Placeholder text: "Happy birthday! You're amazing! 🎉"

**Next:** Tap "Create My Gift Game" (big, glowing button)

---

## THE GENERATION MOMENT

### What Happens (30-Second Window)
1. **Loading overlay** with Dodo animation (`thinking` → `excited`)
2. **Status text** updates in real-time:
   - "Crafting your game..." (0-10s)
   - "Adding personal touches..." (10-20s)
   - "Finalizing magic..." (20-30s)
3. **Progress bar** (indeterminate, but with stages)

### What Actually Happens (Behind the Scenes)
- AI generates game narrative (Grok API call)
- Personalization injected (recipient name, user message)
- Game preview rendered (runner/story/puzzle logic applied)
- Shareable link created (unique ID + metadata)

### Fallback (If Generation Fails)
- **Error state**: Dodo mood → `sleepy`
- **Message**: "Oops! Something went wrong. Let's try again?"
- **Action**: "Retry" button (re-sends request)
- **Logging**: Send error to analytics (for debugging)

---

## THE PREVIEW SCREEN (FIRST SUCCESS MOMENT)

### What Users See
```
┌─────────────────────────────────┐
│  🎮 [Game Preview Window]       │
│  ← Tap to play ↓               │
│                                 │
│  "Your gift game for Sarah!"    │
│  Runner Adventure • Birthday     │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Share Link 🎁         │   │ ← PRIMARY CTA
│  └─────────────────────────┘   │
│                                 │
│  Or: [Play It First]            │ ← Secondary action
│                                 │
│  🦤 "Looks great! Send it!"     │
└─────────────────────────────────┘
```

**Rationale:**
- **Immediate validation**: "I made this!"
- **Clear next action**: Share (not "save" or "edit")
- **Dodo celebrates**: Mood = `celebrating`

### Share Flow
1. Tap "Share Link"
2. Native share sheet opens (WhatsApp, Messages, Instagram, Copy Link)
3. Link includes recipient name: `gameforge.app/gift/sarah-birthday-abc123`
4. **After first preview generation**: Templates, Dodo Assistant, and "How It Works" unlock (see next section)
5. **After first share**: "Your Games" tab unlocks

---

## UNLOCKING FEATURES (POST-FIRST-GAME)

### What Unlocks After First Preview

**Important**: "First preview" = the moment the game preview is generated, **before** the user shares the link.

| Feature | Unlocked When | Where It Appears |
|---------|---------------|------------------|
| **"Templates" tab** | After first preview generated | Bottom tab bar |
| **"Dodo Assistant"** | After first preview generated | Top-right icon (chat bubble) |
| **"How It Works"** | After first preview generated | Settings menu |
| **"Your Games" tab** | After sharing first link | Bottom tab bar (new tab) |
| **Advanced options** | After 3 games created | Wizard has "Customize" toggle |

**Rationale:**
- Users now understand what the app does (less risky to show more)
- They've experienced success (more confident to explore)
- Features feel like "rewards" (not overwhelming initial options)

### Visual Cue for Unlocking
- **Subtle animation**: New tab slides in with sparkle effect
- **Dodo comment**: "You unlocked more features! 🎉"
- **One-time tooltip**: "Tap here to see your games"

---

## EDGE CASES & GUARDRAILS

### 1. User Closes App Mid-Wizard
**Behavior:**
- Save wizard progress locally (AsyncStorage)
- On reopen, show "Continue Your Gift Game" CTA
- Wizard resumes from last completed step

**Why?** Interruptions happen (phone call, notification). Don't punish users.

---

### 2. User Tries to Back Out of Wizard
**Behavior:**
- "Back" button available on each step (except Step 1)
- Tapping "Back" goes to previous question (not home)
- Tapping "X" (close) shows confirmation: "Leave wizard? Progress will be saved."

**Why?** Let users change answers, but don't lose their work.

---

### 3. User Clicks "Play It First" Before Sharing
**Behavior:**
- Game opens in preview mode (not full-screen)
- After 30 seconds (or reaching end), overlay appears: "Ready to share?"
- CTA: "Share Link" (same as preview screen)

**Why?** Some users want to validate quality before sharing.

---

### 4. User Shares Link But Never Returns
**Behavior:**
- No problem! Link works forever (no account required)
- Recipient can play without signing up
- If user returns later, tabs are unlocked (session remembered)

**Why?** Friction-free gifting is the goal. No forced accounts.

---

### 5. User Tries to Access Hidden Features (Via URL/Deep Link)
**Behavior:**
- If first game not completed, redirect to wizard
- Show message: "Create your first gift game to unlock this!"
- Dodo mood: `waving` (friendly, not punitive)

**Why?** Protect the first-time experience, even if user is tech-savvy.

---

## TESTING CHECKLIST

Before shipping any changes to first-time flow:

- [ ] **5-second test**: Show screen to someone unfamiliar. Do they know what to do?
- [ ] **30-second preview**: Time from "Create" tap to preview screen. < 30s?
- [ ] **No distractions**: Zero competing CTAs on home screen?
- [ ] **Progress clarity**: Is progress bar visible on every wizard step?
- [ ] **Error handling**: Test with airplane mode. Does retry work?
- [ ] **Session persistence**: Force-quit mid-wizard. Progress saved?
- [ ] **Unlocking logic**: First game → tabs appear. Verified?
- [ ] **Accessibility**: Screen reader announces progress? Color contrast OK?

---

## METRICS TO WATCH

| Metric | Target | Action If Below |
|--------|--------|-----------------|
| **Wizard start rate** | > 70% | Home screen CTA not clear enough |
| **Wizard completion** | > 80% | Questions too tedious or confusing |
| **Time to first preview** | < 30s | API too slow or wizard too long |
| **Share rate** | > 60% | Preview not impressive or sharing too hard |
| **Return rate (24h)** | > 30% | Unlock features earlier to hook users |

---

## WHAT NOT TO DO (COMMON MISTAKES)

### ❌ Don't Add "Tutorial Mode"
**Wrong:** Overlay with arrows: "Tap here to create!" → "Swipe to see templates!"  
**Right:** Just one CTA. No explanation needed.

### ❌ Don't Show Empty "Your Games" Tab Initially
**Wrong:** Tab exists but says "No games yet. Create one!"  
**Right:** Hide tab until first game is created (no empty states on first visit).

### ❌ Don't Ask for Permissions Up Front
**Wrong:** "Allow notifications" dialog before wizard starts  
**Right:** Ask for notifications after first share (if at all).

### ❌ Don't Make Wizard Steps Optional with "Skip" Buttons
**Wrong:** Every step has "Skip" → Users skip everything → Generic games  
**Right:** Only age is optional (rest are required for personalization).

### ❌ Don't Auto-Open Dodo Assistant on First Visit
**Wrong:** Chat opens: "Hi! I'm Dodo! How can I help?"  
**Right:** Dodo appears in header, but doesn't interrupt (user opens when ready).

---

## FINAL WORD

> **"The first-time flow is not a feature. It's the entire product."**

If users don't complete the first flow, they never see the rest of the app.  
If the first flow feels confusing, they uninstall.  
If the first flow feels magical, they tell their friends.

**Protect it ruthlessly.**

No feature, no experiment, no "quick add" is worth breaking this flow.

---

*First impressions are permanent. Make them count.* 🎯
