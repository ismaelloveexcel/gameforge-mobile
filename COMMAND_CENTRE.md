# PlayGift Command Centre

> A unified dashboard for non-technical operators to monitor and manage the entire PlayGift ecosystem.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COMMAND CENTRE                                │
│                   (What You See & Control)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   HEALTH     │  │   CONTENT    │  │   BUSINESS   │              │
│  │   MONITOR    │  │   PIPELINE   │  │   METRICS    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                          │
        ▼                                          ▼
┌───────────────────┐                    ┌───────────────────┐
│  GAMEFORGE MOBILE │                    │ GAMEDEVELOPMENTHUB│
│  (User-Facing App)│                    │  (Automation Brain)│
├───────────────────┤                    ├───────────────────┤
│ • Gift Wizard     │                    │ • CrewAI Agents   │
│ • Templates       │◄─────────────────► │ • Market Research │
│ • Theming         │    Syncs           │ • Game Validation │
│ • Share Engine    │    Templates       │ • Monetization    │
│ • The Alchemist Companion  │                    │ • Kill-Switch     │
└───────────────────┘                    └───────────────────┘
```

---

## Command Centre Sections

### 1. Health Monitor (Top Row)

Shows real-time status of all systems at a glance.

```
┌─────────────────────────────────────────────────────────────────┐
│                       SYSTEM HEALTH                              │
├────────────────┬────────────────┬────────────────┬──────────────┤
│   APP STATUS   │  AGENTS STATUS │  DEPLOYMENTS   │   ALERTS     │
│   ● ONLINE     │   ● RUNNING    │   ● ALL GREEN  │   0 ACTIVE   │
│   Web + Mobile │   3/4 Active   │   Last: 2h ago │              │
└────────────────┴────────────────┴────────────────┴──────────────┘
```

**Indicators:**
- 🟢 Green = Healthy
- 🟡 Yellow = Warning (needs attention soon)
- 🔴 Red = Critical (action required)

---

### 2. Content Pipeline (Left Panel)

Monitor game templates flowing from research → creation → live.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT PIPELINE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RESEARCH        VALIDATION       TESTING        LIVE           │
│  ─────────       ──────────       ───────        ────           │
│                                                                  │
│  [🔍 3 concepts]  [⚖️ 2 pending]   [🧪 1 testing]  [✅ 15 live]  │
│                                                                  │
│  Latest:         Awaiting:        Score:         Top Performer: │
│  "Cozy Cat       Monetization     Fun: 8/10      "Memory Match" │
│   Quest"         Review           Emotion: 9/10  247 shares     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [View All Concepts]  [Review Queue]  [Test Results]  [Analytics]│
└─────────────────────────────────────────────────────────────────┘
```

**Actions:**
- **View All Concepts** → See what agents are researching
- **Review Queue** → Approve/reject game concepts
- **Test Results** → See how templates scored
- **Analytics** → Which templates perform best

---

### 3. Business Metrics (Right Panel)

Key numbers that matter for the business.

```
┌─────────────────────────────────────────────────────────────────┐
│                    TODAY'S NUMBERS                               │
├────────────────────┬────────────────────┬───────────────────────┤
│   GAMES CREATED    │   GAMES SHARED     │   ESTIMATED REVENUE   │
│        47          │        31          │      AED 890          │
│   ↑ 12% vs yday    │   66% share rate   │   ↑ from conversions  │
├────────────────────┴────────────────────┴───────────────────────┤
│                                                                  │
│   THIS WEEK                                                      │
│   ════════════════════════════════                              │
│   Games Created:  312  (target: 350)  ████████████░░ 89%        │
│   Share Rate:     68%  (target: 60%)  ██████████████████ 113%   │
│   Return Users:   24%  (target: 25%)  █████████████████░ 96%    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  TOP OCCASIONS THIS WEEK                                         │
│  1. Birthday (45%)  2. Anniversary (23%)  3. Valentine's (18%) │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Seasonal Theme Control

Manage the active theme across the app.

```
┌─────────────────────────────────────────────────────────────────┐
│                    THEME CONTROL                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ACTIVE THEME: [Eternal Romance] ▼                             │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  [Preview of current theme colors and UI]               │   │
│   │                                                          │   │
│   │  Deep rose background                                   │   │
│   │  Blush pink accents                                     │   │
│   │  "Romance is in the air" greeting                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   UPCOMING THEMES:                                               │
│   • Feb 15-17: Nocturnal Revival (Ramadan starts Feb 18)        │
│   • Mar 20-25: Golden Reunion (Eid al-Fitr)                     │
│                                                                  │
│   [ Override Theme ]  [ Schedule Custom Theme ]  [ Preview ]    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Agent Workflows

Control and monitor the CrewAI agents.

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT WORKFLOWS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   AGENT                    STATUS        LAST RUN     ACTION    │
│   ──────────────────────   ──────        ────────     ──────    │
│   🎯 Concept Sniper        ● Idle        2h ago       [Run]     │
│   💰 Monetization Enforcer ● Running     Now          [View]    │
│   ⚙️ Automation Architect  ● Idle        4h ago       [Run]     │
│   🚦 Kill-Switch Governor  ● Idle        6h ago       [Run]     │
│                                                                  │
│   NIGHTLY AUTOMATION:  ● Enabled                                │
│   Next Run: Tonight 2:00 AM UTC                                 │
│                                                                  │
│   [ Run All Agents Now ]  [ View Logs ]  [ Configure Schedule ] │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Pending Reviews

Items requiring your decision.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PENDING YOUR REVIEW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ⚠️  2 Game Concepts Awaiting Approval                         │
│   ├── "Cozy Cat Quest" - Runner for animal lovers               │
│   │   Revenue potential: AED 12k/month  [Approve] [Reject]      │
│   │                                                              │
│   └── "Memory Lane" - Photo-based puzzle                        │
│       Revenue potential: AED 8k/month   [Approve] [Reject]      │
│                                                                  │
│   📋 1 Template Ready for Release                                │
│   └── "Heartfelt Runner v2" - Test score: 9.2/10               │
│       [Preview] [Release to Production] [Send Back]             │
│                                                                  │
│   🔧 1 Technical Issue                                           │
│   └── Deploy failed: Missing Vercel token                       │
│       [View Details] [Dismiss]                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. Quick Actions (Bottom Bar)

Common tasks accessible with one tap.

```
┌─────────────────────────────────────────────────────────────────┐
│                       QUICK ACTIONS                              │
├────────────┬────────────┬────────────┬────────────┬─────────────┤
│  📊 View   │  🎮 Test   │  📱 Deploy │  📧 Send   │  ⚙️ Settings │
│  Reports   │  New Game  │  Update    │  Marketing │             │
└────────────┴────────────┴────────────┴────────────┴─────────────┘
```

---

## User Permissions

| Role | Access Level |
|------|-------------|
| **Owner** | Full access - all settings, approvals, deployments |
| **Manager** | Metrics, approvals, theme control (no deployments) |
| **Viewer** | Read-only dashboard access |

---

## Technical Implementation

### Where It Lives
The Command Centre can be implemented as:
1. **Web Dashboard** (recommended) - Standalone Next.js app
2. **Admin Screen in App** - Hidden screen for authenticated admins
3. **GitHub Dashboard** - Using GitHub Actions + Issues as backend

### Data Sources

| Data | Source |
|------|--------|
| App metrics | Analytics API (Firebase/Mixpanel) |
| Agent status | GitHub Actions API |
| Theme status | App's ThemeContext state |
| Content pipeline | GameDevelopmentHub database/files |
| Pending reviews | GitHub Issues + PR API |

### API Endpoints Needed

```typescript
// Metrics
GET /api/metrics/today
GET /api/metrics/weekly

// Agents
GET /api/agents/status
POST /api/agents/:id/run
GET /api/agents/logs

// Themes
GET /api/themes/current
POST /api/themes/override
GET /api/themes/schedule

// Content
GET /api/content/pipeline
POST /api/content/:id/approve
POST /api/content/:id/reject

// Reviews
GET /api/reviews/pending
POST /api/reviews/:id/decision
```

---

## Mobile-Friendly View

For checking on-the-go:

```
┌─────────────────────┐
│  GAMEFORGE HQ       │
├─────────────────────┤
│  ● All Systems OK   │
│                     │
│  TODAY              │
│  47 games created   │
│  31 shared (66%)    │
│                     │
│  ⚠️ 2 items pending │
│  [Review Now →]     │
│                     │
│  ─────────────────  │
│  THEME: Romance     │
│  [Change →]         │
│                     │
│  ─────────────────  │
│  AGENTS: 3/4 active │
│  [View →]           │
└─────────────────────┘
```

---

## Implementation Priority

1. **Phase 1: Read-Only Dashboard**
   - Health monitoring
   - Metrics display
   - Theme status

2. **Phase 2: Control Features**
   - Theme override
   - Agent triggers
   - Approval workflow

3. **Phase 3: Full Automation**
   - Scheduled reports
   - Alert notifications
   - Auto-scaling triggers

---

*This Command Centre puts you in control without needing to touch code.*
