# Repository Management Strategy
## Managing GameForge Mobile + GameDevelopmentHub (Automation Brain)

> **Goal:** Run both repos as a unified, automated side hustle requiring <5 hours/week oversight from a non-technical owner.

---

## 🎯 Current State

### What Exists Today

**GameForge Mobile** ✅ EXISTS
- **Purpose:** User-facing app (iOS/Android/Web)
- **Location:** `github.com/ismaelloveexcel/gameforge-mobile`
- **Status:** Code complete but needs redesign
- **Tech Stack:** React Native, Expo, TypeScript
- **Main Features:** Gift wizard, templates, theming, Genie AI
- **Current State:** 80% infrastructure, 20% user experience

**GameDevelopmentHub** ❌ DOESN'T EXIST YET
- **Purpose:** Automation brain (CrewAI agents, market research, content generation)
- **Location:** NEEDS TO BE CREATED
- **Status:** Conceptual (documented in UNIFIED_ECOSYSTEM.md)
- **Tech Stack:** Python, CrewAI, Grok AI, GitHub Actions
- **Main Features:** Market research agent, game creator agent, QA agent, monetization validator

**Note:** There is an `autonomous-product-factory` repo which could potentially be adapted for this purpose.

---

## 🏗️ The Two-Repo Architecture

### Why Two Repositories?

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  GAMEFORGE MOBILE                 GAMEDEVELOPMENTHUB     │
│  (React Native)                   (Python + CrewAI)      │
│  ─────────────────                ──────────────────     │
│                                                          │
│  ┌────────────────┐              ┌────────────────┐     │
│  │  USER FACING   │◄────────────►│   AUTOMATION   │     │
│  │                │   Syncs      │     BRAIN      │     │
│  │  • Gift wizard │   Content    │                │     │
│  │  • Templates   │              │  • Agents      │     │
│  │  • Theming     │              │  • Research    │     │
│  │  • Payments    │              │  • Generation  │     │
│  │  • Analytics   │              │  • Validation  │     │
│  └────────────────┘              └────────────────┘     │
│         │                                │              │
│         └────────────────┬───────────────┘              │
│                          │                              │
│                          ▼                              │
│                ┌──────────────────┐                     │
│                │  SHARED BACKEND  │                     │
│                │  (Supabase/      │                     │
│                │   Firebase)      │                     │
│                └──────────────────┘                     │
│                          │                              │
│                 ┌────────┴────────┐                     │
│                 ▼                 ▼                     │
│          ┌──────────┐      ┌──────────┐                │
│          │  GAMES   │      │  METRICS │                │
│          │ CATALOG  │      │  & LOGS  │                │
│          └──────────┘      └──────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Separation of Concerns

| Aspect | GameForge Mobile | GameDevelopmentHub |
|--------|-----------------|-------------------|
| **Language** | TypeScript/JavaScript | Python |
| **Purpose** | User experience | Automation & intelligence |
| **Users** | End consumers | Owner (you) + agents |
| **Updates** | Daily (UX iterations) | Weekly (agent improvements) |
| **Deploys** | Expo EAS + Vercel | GitHub Actions (scheduled) |
| **Complexity** | Medium (React Native) | High (AI agents, orchestration) |
| **Critical?** | YES (downtime = no revenue) | Somewhat (can run manually short-term) |

---

## 📋 Management Approach

### Option 1: Monorepo (NOT RECOMMENDED)

```
gameforge/
├── mobile/           (React Native app)
├── automation/       (Python agents)
├── shared/           (Common configs)
└── infrastructure/   (Deployment)
```

**Pros:**
- Single place for everything
- Easier to sync versions

**Cons:**
- ❌ Complicated CI/CD (two different tech stacks)
- ❌ Conflicting dependencies (Node vs Python)
- ❌ Harder to deploy independently
- ❌ Single point of failure
- ❌ Confusing for contributors

**Verdict:** ⛔ Don't do this

---

### Option 2: Separate Repos with Shared Backend (RECOMMENDED)

```
github.com/ismaelloveexcel/
├── gameforge-mobile/          ← User-facing app
│   └── Deploys to Expo + Vercel
│
├── gameforge-automation/      ← Agent brain (rename from GameDevelopmentHub)
│   └── Runs on GitHub Actions (scheduled)
│
└── gameforge-content-api/     ← Optional: Shared API
    └── Deployed to Vercel/Railway
```

**Pros:**
- ✅ Clean separation of concerns
- ✅ Independent deployment pipelines
- ✅ Different tech stacks don't conflict
- ✅ Easier to maintain
- ✅ Can scale independently
- ✅ Contributors work in their comfort zone

**Cons:**
- Need to sync data between repos (solved with shared database)
- Slightly more setup complexity (worth it)

**Verdict:** ✅ This is the way

---

## 🔄 Data Synchronization Strategy

### The Shared Backend

Use **Supabase** (recommended) or **Firebase** as the single source of truth.

```typescript
// Shared Database Schema

// 1. GAMES CATALOG (Written by agents, read by mobile)
TABLE featured_games {
  id: uuid
  name: string
  description: text
  tier: enum('free', 'featured', 'premium', 'exclusive')
  price_aed: number
  category: string           // 'seasonal', 'trending', 'curated'
  occasion: string?          // 'valentine', 'eid', 'birthday'
  valid_until: timestamp?    // For seasonal drops
  created_by: enum('agent', 'manual', 'community')
  status: enum('draft', 'live', 'archived')
  
  // Game data
  game_data: jsonb           // Template configuration
  personalization_options: jsonb
  preview_url: string
  thumbnail_url: string
  
  // Stats (updated by mobile app)
  stats: jsonb {
    gifted_count: number
    avg_rating: number
    share_rate: number
    revenue_generated: number
  }
  
  created_at: timestamp
  updated_at: timestamp
}

// 2. GIFT INSTANCES (Created by mobile users)
TABLE gift_instances {
  id: uuid
  game_id: uuid → featured_games
  created_by_user_id: string
  recipient_name: string
  sender_name: string
  custom_message: text
  occasion: string
  
  // Viral tracking
  share_url: string          // Unique shareable URL
  opened_at: timestamp?
  played_count: number
  completed: boolean
  recipient_gifted_back: boolean
  
  // Monetization
  payment_status: enum('free', 'pending', 'paid', 'refunded')
  amount_paid_aed: number
  
  created_at: timestamp
}

// 3. ANALYTICS (Written by mobile, read by command centre)
TABLE analytics_events {
  id: uuid
  event_type: string         // 'game_created', 'gift_shared', 'gift_opened', etc.
  user_id: string?
  gift_id: uuid?
  game_id: uuid?
  metadata: jsonb
  timestamp: timestamp
}

// 4. AGENT LOGS (Written by agents, read by command centre)
TABLE agent_runs {
  id: uuid
  agent_name: string         // 'concept_sniper', 'monetization_enforcer', etc.
  status: enum('running', 'success', 'failed')
  started_at: timestamp
  completed_at: timestamp?
  
  input: jsonb               // What the agent was tasked with
  output: jsonb              // What the agent produced
  logs: text                 // Execution logs
  error: text?               // Error if failed
}

// 5. COMMAND CENTRE CONFIG (Managed by owner)
TABLE app_config {
  key: string PRIMARY KEY
  value: jsonb
  updated_at: timestamp
  updated_by: string
}
// Examples:
// key='active_theme' value='{"name":"Eternal Romance","colors":{...}}'
// key='featured_games_order' value='["uuid1","uuid2","uuid3"]'
// key='seasonal_override' value='{"active":true,"end_date":"2026-02-20"}'
```

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  NIGHTLY AGENT RUN (GameDevelopmentHub)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Market Research Agent runs                          │
│     └─→ Writes to agent_runs table                     │
│                                                          │
│  2. Game Creator Agent runs                             │
│     └─→ Creates draft game in featured_games table     │
│                                                          │
│  3. QA Agent validates                                  │
│     └─→ Updates status to 'live' if approved           │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  MOBILE APP (GameForge Mobile)                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Home screen queries featured_games WHERE status='live'│
│     └─→ Displays to user                               │
│                                                          │
│  2. User creates gift                                   │
│     └─→ Inserts into gift_instances                    │
│     └─→ Fires analytics_events                         │
│                                                          │
│  3. User pays AED 15                                    │
│     └─→ Updates payment_status                         │
│     └─→ Updates featured_games.stats.revenue_generated  │
│                                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  COMMAND CENTRE (GameForge Mobile - Admin Screen)       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Dashboard queries analytics_events                  │
│     └─→ Shows "47 games created today"                 │
│                                                          │
│  2. Agent status queries agent_runs                     │
│     └─→ Shows "Last run: 2h ago, Status: Success"      │
│                                                          │
│  3. Revenue queries gift_instances + featured_games     │
│     └─→ Shows "AED 890 today"                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Guide: Creating the Two-Repo System

### Step 1: Setup Shared Backend (Week 1)

#### Option A: Supabase (Recommended)

```bash
# 1. Create Supabase project at supabase.com
# 2. Run schema creation

# Create tables
CREATE TABLE featured_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  tier TEXT CHECK (tier IN ('free', 'featured', 'premium', 'exclusive')),
  price_aed NUMERIC DEFAULT 0,
  category TEXT,
  occasion TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  status TEXT DEFAULT 'draft',
  game_data JSONB,
  personalization_options JSONB,
  preview_url TEXT,
  thumbnail_url TEXT,
  stats JSONB DEFAULT '{"gifted_count":0,"avg_rating":0,"share_rate":0,"revenue_generated":0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repeat for other tables...

# 3. Get your Supabase URL and anon key
# 4. Add to both repos as environment variables
```

#### Option B: Firebase

```bash
# 1. Create Firebase project
firebase init firestore

# 2. Deploy security rules
# 3. Add Firebase config to both repos
```

---

### Step 2: Setup GameForge Mobile Backend Connection (Week 1)

```bash
cd gameforge-mobile

# Install Supabase client
npm install @supabase/supabase-js

# Create .env
echo "SUPABASE_URL=https://your-project.supabase.co" >> .env
echo "SUPABASE_ANON_KEY=your-anon-key" >> .env
```

```typescript
// src/services/SupabaseService.ts
import { createClient } from '@supabase/supabase-js';

// For React Native with Expo, use EXPO_PUBLIC_ prefix for environment variables
// These are accessible at runtime and bundled with the app
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example: Fetch featured games
export async function getFeaturedGames() {
  const { data, error } = await supabase
    .from('featured_games')
    .select('*')
    .eq('status', 'live')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Example: Track gift creation
export async function createGiftInstance(giftData: any) {
  const { data, error } = await supabase
    .from('gift_instances')
    .insert([giftData])
    .select();
  
  if (error) throw error;
  
  // Fire analytics event
  await supabase.from('analytics_events').insert([{
    event_type: 'gift_created',
    gift_id: data[0].id,
    game_id: giftData.game_id,
    timestamp: new Date().toISOString()
  }]);
  
  return data[0];
}
```

---

### Step 3: Create GameDevelopmentHub Repo (Week 2)

```bash
# Option A: Create new repo
gh repo create ismaelloveexcel/gameforge-automation --public

# Option B: Rename existing autonomous-product-factory
gh repo rename autonomous-product-factory gameforge-automation

cd gameforge-automation

# Setup Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install crewai grok-python supabase-py python-dotenv pyyaml

# Create .env
echo "SUPABASE_URL=https://your-project.supabase.co" >> .env
echo "SUPABASE_SERVICE_KEY=your-service-key" >> .env  # Use service key for agents
echo "GROK_API_KEY=your-grok-key" >> .env
```

```python
# src/agents/market_researcher.py
from crewai import Agent, Task, Crew
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# Define the Market Research Agent
researcher = Agent(
    role='Market Researcher',
    goal='Find trending gift occasions and game concepts',
    backstory='Expert at analyzing social media trends and identifying viral opportunities',
    verbose=True,
    allow_delegation=False
)

# Define task
research_task = Task(
    description='Research trending gift occasions for the UAE market in the next 30 days',
    agent=researcher
)

# Run crew
crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    verbose=2
)

result = crew.kickoff()

# Log to database
supabase.table('agent_runs').insert({
    'agent_name': 'market_researcher',
    'status': 'success',
    'output': result,
    'completed_at': 'NOW()'  # Use NOW() function, not string literal
}).execute()

print(result)
```

---

### Step 4: Setup GitHub Actions Automation (Week 2)

```yaml
# .github/workflows/nightly-agents.yml
name: Nightly Agent Run

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily (6 AM GST/UAE time)
  workflow_dispatch:      # Manual trigger

jobs:
  run-agents:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run Market Research Agent
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          GROK_API_KEY: ${{ secrets.GROK_API_KEY }}
        run: |
          python src/agents/market_researcher.py
      
      - name: Run Game Creator Agent
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          GROK_API_KEY: ${{ secrets.GROK_API_KEY }}
        run: |
          python src/agents/game_creator.py
      
      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Nightly Agent Run Failed',
              body: 'The nightly agent run failed. Check logs: ' + context.payload.workflow_run.html_url,
              labels: ['automation', 'urgent']
            })
```

---

## 📊 Command Centre Integration

### Real-Time Metrics (Not Mock Data)

```typescript
// src/screens/CommandCentreScreen.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../services/SupabaseService';

export function CommandCentreScreen() {
  const [metrics, setMetrics] = useState({
    gamesCreatedToday: 0,
    gamesSharedToday: 0,
    revenueToday: 0,
    shareRate: 0
  });
  
  const [agentStatus, setAgentStatus] = useState([]);
  
  useEffect(() => {
    fetchMetrics();
    fetchAgentStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics();
      fetchAgentStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  async function fetchMetrics() {
    // Today's games created
    const { count: createdCount } = await supabase
      .from('gift_instances')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().setHours(0,0,0,0));
    
    // Today's games shared
    const { count: sharedCount } = await supabase
      .from('gift_instances')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().setHours(0,0,0,0))
      .not('share_url', 'is', null);
    
    // Today's revenue
    const { data: revenueData } = await supabase
      .from('gift_instances')
      .select('amount_paid_aed')
      .eq('payment_status', 'paid')
      .gte('created_at', new Date().setHours(0,0,0,0));
    
    const revenue = revenueData?.reduce((sum, row) => sum + row.amount_paid_aed, 0) || 0;
    
    setMetrics({
      gamesCreatedToday: createdCount || 0,
      gamesSharedToday: sharedCount || 0,
      revenueToday: revenue,
      shareRate: createdCount > 0 ? (sharedCount / createdCount * 100) : 0
    });
  }
  
  async function fetchAgentStatus() {
    const { data } = await supabase
      .from('agent_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);
    
    setAgentStatus(data || []);
  }
  
  return (
    <View>
      <Text>Games Created Today: {metrics.gamesCreatedToday}</Text>
      <Text>Games Shared: {metrics.gamesSharedToday} ({metrics.shareRate.toFixed(1)}%)</Text>
      <Text>Revenue Today: AED {metrics.revenueToday.toFixed(2)}</Text>
      
      <Text style={{marginTop: 20}}>Agent Status:</Text>
      {agentStatus.map(run => (
        <View key={run.id}>
          <Text>{run.agent_name}: {run.status} ({formatTimeAgo(run.started_at)})</Text>
        </View>
      ))}
    </View>
  );
}
```

---

## 🔐 Security & Access Control

### Environment Variables

**GameForge Mobile (.env):**
```bash
# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...  # Public key, safe for mobile

# AI Services
GROK_API_KEY=xai-xxx         # Optional, for client-side AI

# Payments
PAYTABS_SERVER_KEY=xxx       # For UAE payments
PAYTABS_PROFILE_ID=xxx

# Analytics
MIXPANEL_TOKEN=xxx
```

**GameForge Automation (.env):**
```bash
# Backend (needs admin access)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  # Service role key, admin access

# AI Services
GROK_API_KEY=xai-xxx         # For agents
OPENAI_API_KEY=sk-xxx        # Backup AI

# Monitoring
SENTRY_DSN=xxx               # Error tracking
```

### Supabase Row-Level Security (RLS)

```sql
-- featured_games: Anyone can read live games, only agents can write
ALTER TABLE featured_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view live games"
  ON featured_games FOR SELECT
  USING (status = 'live');

-- Note: Service role key bypasses RLS entirely
-- This policy is for API key-based access with specific JWT claims
-- For true service role access, use the service_role key which bypasses RLS
CREATE POLICY "API keys with service claim can manage games"
  ON featured_games FOR ALL
  USING (
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

-- gift_instances: Users can read their own, service can read all
ALTER TABLE gift_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their gifts"
  ON gift_instances FOR SELECT
  USING (auth.uid() = created_by_user_id);

CREATE POLICY "Service role can view all gifts"
  ON gift_instances FOR SELECT
  USING (auth.jwt()->>'role' = 'service_role');

-- analytics_events: Only service role can access
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access analytics"
  ON analytics_events FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

---

## 📅 Maintenance Schedule

### Daily (Automated via GitHub Actions)
- 2:00 AM: Market research agent runs
- 2:30 AM: Game creator agent runs
- 3:00 AM: QA agent validates
- 3:30 AM: Featured games updated
- 4:00 AM: Database backup

### Weekly (5 minutes of your time)
- **Monday:** Review Command Centre metrics
  - Check revenue vs. target
  - Identify top-performing games
  - Approve/reject agent-created concepts
- **Wednesday:** Check agent logs
  - Verify all agents ran successfully
  - Review any errors
- **Friday:** Plan next week
  - Set seasonal themes
  - Review upcoming occasions

### Monthly (1 hour of your time)
- Review analytics deep-dive
- Adjust agent parameters based on performance
- Plan next month's seasonal content
- Financial reconciliation

---

## 🚨 Troubleshooting

### Issue: Agents not running
**Check:**
1. GitHub Actions secrets are set correctly
2. Supabase service key hasn't expired
3. GitHub Actions quota not exceeded (2000 min/month free)

**Fix:**
```bash
# Check most recent agent run
gh run list --workflow=nightly-agents.yml

# View logs
gh run view <run-id> --log
```

### Issue: Mobile app not showing new games
**Check:**
1. Games have `status='live'` in database
2. Mobile app is fetching from correct Supabase project
3. Cache might need clearing

**Fix:**
```typescript
// Clear cache and refetch
await supabase.removeAllChannels();
const { data } = await supabase
  .from('featured_games')
  .select('*')
  .eq('status', 'live');
```

### Issue: Metrics showing wrong data
**Check:**
1. Timezone issues (everything should be UTC)
2. Date filters in queries
3. RLS policies blocking reads

**Fix:**
```sql
-- Verify data exists
SELECT COUNT(*) FROM gift_instances 
WHERE created_at >= CURRENT_DATE;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'gift_instances';
```

---

## 📈 Scaling Strategy

### Phase 1: MVP (Months 1-3)
- **Mobile:** Single Expo app
- **Automation:** GitHub Actions (free tier: 2000 min/month)
- **Backend:** Supabase free tier (500 MB, 2 GB transfer)
- **Cost:** AED 0/month
- **Capacity:** ~1000 gift creations/month

### Phase 2: Growth (Months 4-6)
- **Mobile:** Same
- **Automation:** Upgrade GitHub Actions ($4/month = AED 15)
- **Backend:** Supabase Pro ($25/month = AED 92)
- **Cost:** AED 107/month
- **Capacity:** ~10,000 gift creations/month

### Phase 3: Scale (Months 7-12)
- **Mobile:** Add CDN for assets
- **Automation:** Move to dedicated server (Railway/Render)
- **Backend:** Supabase Team ($599/month = AED 2,200)
- **Cost:** AED 2,500/month
- **Capacity:** ~100,000 gift creations/month
- **Revenue at this point:** AED 50,000+/month (profitable)

---

## ✅ Quick Start Checklist

### Week 1: Setup Shared Backend
- [ ] Create Supabase account
- [ ] Run database schema SQL
- [ ] Get API keys (URL + anon key + service key)
- [ ] Test connection from local machine
- [ ] Add secrets to GitHub

### Week 2: Connect GameForge Mobile
- [ ] Install `@supabase/supabase-js`
- [ ] Create `SupabaseService.ts`
- [ ] Update Command Centre to fetch real data
- [ ] Test gift creation flow with database
- [ ] Verify analytics tracking

### Week 3: Create GameDevelopmentHub Repo
- [ ] Create repo: `gameforge-automation`
- [ ] Setup Python environment
- [ ] Install CrewAI + dependencies
- [ ] Write first agent (market researcher)
- [ ] Test agent writes to database

### Week 4: Automate with GitHub Actions
- [ ] Create `.github/workflows/nightly-agents.yml`
- [ ] Add secrets (SUPABASE_*, GROK_API_KEY)
- [ ] Run manual test
- [ ] Schedule nightly runs
- [ ] Setup failure notifications

---

## 🎯 Success Criteria

You'll know the two-repo system is working when:

1. **GameForge Mobile:**
   - ✅ Command Centre shows real-time metrics (not mock)
   - ✅ Featured games appear from database
   - ✅ Gift creation saves to database
   - ✅ Payment processing works
   - ✅ Analytics events fire correctly

2. **GameDevelopmentHub:**
   - ✅ Agents run nightly (check GitHub Actions)
   - ✅ New game concepts appear in database
   - ✅ Agent logs visible in Command Centre
   - ✅ No manual intervention needed

3. **Integration:**
   - ✅ Agent-created games show up in mobile app
   - ✅ Mobile analytics visible in Command Centre
   - ✅ You spend <5 hours/week managing both
   - ✅ Revenue flows automatically

---

## 📚 Further Reading

- [Supabase Documentation](https://supabase.com/docs)
- [CrewAI Documentation](https://docs.crewai.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Documentation](https://docs.expo.dev)

---

**Status:** Ready for implementation  
**Complexity:** Medium (requires 4 weeks setup)  
**Maintenance:** <5 hours/week after setup  
**Cost:** AED 0-100/month (scales with usage)

**Next Action:** Start with Week 1 checklist above
