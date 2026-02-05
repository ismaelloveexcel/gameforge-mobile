# Repository Supervisor: Your Automated Repo Manager

> **What it is:** An AI-powered system that acts as your repository's supervisor, automatically managing code, branches, pull requests, and coordinating specialist agents - so you don't have to.

## 🎯 What Does It Do For You?

Think of the Repository Supervisor as your **always-on technical manager** who:

1. **Watches Everything** 🔍
   - Monitors all code changes 24/7
   - Tracks pull requests and their age
   - Keeps an eye on all branches
   - Checks that workflows are running smoothly

2. **Fixes Problems Automatically** 🔧
   - Resolves simple merge conflicts
   - Cleans up old, unused branches
   - Restarts failed builds
   - Fixes formatting and linting issues

3. **Manages Your Team of Agents** 👥
   - Assigns tasks to specialist agents based on expertise
   - Monitors their work quality
   - Ensures they complete tasks on time
   - Escalates if they get stuck

4. **Keeps You Informed** 📊
   - Sends daily health reports
   - Alerts you to urgent issues
   - Provides simple explanations (no tech jargon!)
   - Shows metrics that matter

## 📋 Daily Operations (Automatic!)

### Morning (6 AM GST)
- ✅ Checks repository health
- ✅ Reviews all open pull requests
- ✅ Validates deployment pipelines
- ✅ Scans for security issues

### Throughout the Day
- ✅ Monitors PR age (intervenes if >24 hours)
- ✅ Detects stale branches (>7 days inactive)
- ✅ Watches agent workflows
- ✅ Tracks deployment health

### Evening (6 PM GST)
- ✅ Generates daily summary
- ✅ Reports issues resolved
- ✅ Highlights metrics and trends
- ✅ Creates action items for tomorrow

## 🤝 Your Specialist Agent Team

The supervisor coordinates these specialist agents:

### 1. FORGE-CHIEF (Aesthetics) 🎨
**What they do:** UI/UX design, first-time user experience, visual design
**When called:** Design changes, user experience issues, visual improvements
**Example:** "Make the gift wizard more intuitive for first-time users"

### 2. CODE-SENTINEL 🛡️
**What they do:** Code quality, bug fixes, testing, TypeScript issues
**When called:** Bugs, quality issues, test failures, code reviews
**Example:** "Fix the failing test in GiftGameScreen component"

### 3. CONTENT-PIPELINE 📦
**What they do:** Game template creation, content automation, validation
**When called:** New game templates, content updates, template validation
**Example:** "Create a new Valentine's Day themed game template"

### 4. DEPLOYMENT-GUARDIAN 🚀
**What they do:** Deployment validation, CI/CD fixes, production readiness
**When called:** Deployment failures, CI issues, release preparation
**Example:** "Fix the failed web deployment on Vercel"

## 📱 How to Use It

### View Repository Health

1. Go to your GitHub repository
2. Click **Actions** tab
3. Look for **Repository Supervisor - Health & Monitoring**
4. View latest run for current health report

**What the health score means:**
- 🟢 **90-100:** Excellent! Everything running smoothly
- 🟡 **70-89:** Good, minor attention needed
- 🟠 **50-69:** Fair, action required soon
- 🔴 **Below 50:** Needs immediate attention

### Delegate a Task to an Agent

**Option 1: Via GitHub Issues**
1. Create a new issue
2. Add appropriate label:
   - `ui`, `ux`, or `design` → Goes to FORGE-CHIEF
   - `bug`, `quality`, or `testing` → Goes to CODE-SENTINEL
   - `content`, `template`, or `game` → Goes to CONTENT-PIPELINE
   - `deployment`, `ci`, or `cd` → Goes to DEPLOY-GUARDIAN
3. The supervisor will automatically assign it!

**Option 2: Via Workflow (Manual)**
1. Go to **Actions** tab
2. Select **Repository Supervisor - Agent Orchestration**
3. Click **Run workflow**
4. Choose:
   - Which agent to use
   - Task description
   - Priority level
5. Click **Run workflow**

The supervisor will create a branch and notify the agent to start work.

### Check on Stale Pull Requests

The supervisor automatically:
- Comments on PRs older than 24 hours
- Identifies the blocker (conflicts, failing tests, awaiting review)
- Suggests specific fixes
- Tags appropriate agents for help

**You'll see comments like:**
> 🚨 **Repository Supervisor Alert**
> 
> This PR has been open for 26 hours with **merge conflicts**.
> 
> **Recommended Actions:**
> 1. Rebase against main: `git rebase origin/main`
> 2. Resolve conflicts
> 3. Push updated branch

### Clean Up Old Branches

When branches haven't been touched in 30+ days:
1. Supervisor creates an issue listing them
2. Reviews each to ensure no valuable work
3. Awaits your approval to delete
4. Can auto-cleanup branches with merged/closed PRs

**To approve auto-cleanup:**
- Comment `auto-cleanup approved` on the issue

## 📊 Understanding the Reports

### Daily Health Report

```
🏥 Repository Health Report

Pull Request Health
- Total Open PRs: 3
- Stale PRs (>24h): 1

Branch Health
- Total Remote Branches: 28
- Obsolete Branches (>30d): 2

Workflow Health
- Workflows with Recent Failures: 0

🎯 Overall Health Score: 85/100
Status: 🟡 Good (minor attention needed)
```

**What to do:**
- **Score 90+:** 🎉 Nothing needed, keep it up!
- **Score 70-89:** Review the stale items when convenient
- **Score 50-69:** Take action on flagged items this week
- **Score <50:** Address urgent issues immediately

### Agent Task Status

You'll receive updates when:
- ✅ Agent starts working on a task
- ✅ Agent completes a task
- ✅ Agent needs more information
- ⚠️ Agent is overdue (>48 hours)

## 🚨 When You Need to Take Action

The supervisor will escalate to you for:

### Urgent Issues (Immediate Action)
- 🚨 Production is down
- 🚨 Security vulnerability found
- 🚨 Payment system issues
- 🚨 Data loss risk

**You'll receive:** GitHub issue labeled `urgent`

### Important Issues (Within 24h)
- ⚠️ Multiple PRs stale for >48 hours
- ⚠️ Agent tasks overdue
- ⚠️ Workflow failures persist
- ⚠️ Health score drops below 50

**You'll receive:** GitHub issue labeled `high-priority`

### Review Needed (Within Week)
- 📋 Agent-created game templates
- 📋 Major architectural changes
- 📋 Obsolete branch cleanup
- 📋 New feature proposals

**You'll receive:** GitHub issue labeled `review-needed`

## 💬 Communication Examples

### How the Supervisor Talks to You

**Technical explanation:**
> Build failed due to TypeScript compilation error on line 47 in GiftGameScreen.tsx. Missing type annotation for 'gameData' parameter.

**Becomes:**
> The website build failed because there's a small code issue. Don't worry - I've assigned CODE-SENTINEL to fix it. You'll have an update in a few hours.

### How to Talk to the Supervisor

Instead of:
> "The CI/CD pipeline is failing on the deploy-web.yml workflow"

Just say:
> "The website deployment isn't working"

The supervisor understands both! 😊

## ⚙️ Configuration (Advanced)

### Adjust Supervisor Behavior

Edit `.github/workflows/repo-supervisor.yml` to change:

**Check frequency:**
```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```
Change to `*/3` for every 3 hours, or `*/12` for twice daily.

**PR staleness threshold:**
```yaml
# In the script, find this line:
select((now - (.createdAt | fromdateiso8601)) > 86400)
```
- `86400` = 24 hours (current)
- `43200` = 12 hours (more aggressive)
- `172800` = 48 hours (more relaxed)

**Branch obsolescence:**
```yaml
THIRTY_DAYS_AGO=$((CURRENT_TIME - 2592000))
```
- `2592000` = 30 days (current)
- `1296000` = 15 days (more aggressive)
- `5184000` = 60 days (more relaxed)

## 📈 Success Metrics

**How to know it's working:**

✅ **PR Resolution Time**
- Target: <24 hours average
- Current: Check health report

✅ **Branch Cleanliness**
- Target: 0 obsolete branches
- Current: Check health report

✅ **Agent Task Completion**
- Target: 95%+ on-time completion
- Current: Check agent orchestration logs

✅ **Your Time Saved**
- Target: <5 hours/week of manual work
- Measure: Track time spent on repo management

## 🆘 Troubleshooting

### "I don't see the supervisor running"

**Check:**
1. Go to Actions tab
2. Look for "Repository Supervisor - Health & Monitoring"
3. Check if workflow is enabled (green button, not gray)

**If disabled:**
1. Click on the workflow
2. Click "Enable workflow"

### "Supervisor commented but didn't fix the issue"

**This is normal if:**
- Issue requires human decision (e.g., major architectural change)
- Security-sensitive change (e.g., payment logic)
- Multiple valid approaches (needs your preference)

**The supervisor will:**
- Explain what it found
- Suggest options
- Wait for your direction

### "Agent task is overdue"

**Usually means:**
- Task scope is too large
- Agent needs more information
- Technical blocker encountered

**You'll receive:**
- Issue with "agent-overdue" label
- Explanation of situation
- Recommended actions

**You can:**
1. Provide more details
2. Break task into smaller pieces
3. Assign to human developer

## 📅 Weekly Routine (Recommended)

### Monday (5 minutes)
- Check health score
- Review any urgent issues
- Approve/reject agent-created content

### Wednesday (5 minutes)
- Review agent task status
- Check for any overdue items
- Verify deployments are green

### Friday (10 minutes)
- Review weekly metrics
- Plan next week's priorities
- Approve branch cleanups

### Monthly (30 minutes)
- Deep-dive into trends
- Adjust supervisor settings if needed
- Review agent performance
- Plan improvements

## 🎓 Tips for Success

1. **Trust the System** 
   - The supervisor is designed to handle 90% of tasks automatically
   - It will escalate when it needs you

2. **Provide Clear Feedback**
   - When you override a decision, explain why
   - The supervisor learns from your preferences

3. **Use the Specialist Agents**
   - They're experts in their domains
   - Delegate freely - that's what they're for!

4. **Check Health Reports**
   - Weekly reviews keep you informed
   - Catch issues before they become urgent

5. **Keep It Simple**
   - The goal is minimal manual work
   - If something requires repeated manual intervention, tell the supervisor
   - It can be automated!

## 📞 Getting Help

**For technical supervisor issues:**
- Create GitHub issue with label `supervisor-help`
- Describe what's not working
- Include any error messages

**For strategic decisions:**
- Tag `@repo-supervisor` in issues
- Ask questions in plain language
- Provide context about business goals

---

## 🎉 Bottom Line

**You have a supervisor that:**
- ✅ Works 24/7 without breaks
- ✅ Never forgets to check something
- ✅ Coordinates your entire agent team
- ✅ Keeps everything organized and clean
- ✅ Only bothers you when truly needed
- ✅ Speaks your language (no jargon!)

**Your job:**
- ✅ Check weekly health reports (5 min)
- ✅ Make strategic decisions when asked
- ✅ Approve important changes
- ✅ Focus on growing the business!

**Result:**
- ✅ Repository stays healthy automatically
- ✅ PRs don't get stale
- ✅ Branches stay clean
- ✅ Agents stay productive
- ✅ You stay sane! 😊

---

*The Repository Supervisor: Because you have better things to do than babysit code all day.*
