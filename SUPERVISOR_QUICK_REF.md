# Repository Supervisor Quick Reference

## 🚀 Quick Commands

### Check Repository Health
```bash
npm run health
```
Shows instant health check with PR, branch, and workflow status.

### Trigger Supervisor Check
```bash
npm run supervisor:check
```
Manually triggers the Repository Supervisor workflow to run health checks immediately.

### View Supervisor Status
```bash
npm run supervisor:status
```
Shows the last 5 supervisor workflow runs and their results.

---

## 📊 Understanding Health Scores

| Score | Status | Meaning | Action |
|-------|--------|---------|--------|
| 90-100 | 🟢 Excellent | Everything running smoothly | Keep it up! |
| 70-89 | 🟡 Good | Minor issues present | Review when convenient |
| 50-69 | 🟠 Fair | Action needed soon | Address this week |
| 0-49 | 🔴 Critical | Immediate attention required | Fix now |

**Score Calculation:**
- Base: 100 points
- Stale PR (>24h): -5 points each
- Obsolete branch (>30d): -2 points each
- Failed workflow: -10 points each

---

## 🤖 Available Agents

### FORGE-CHIEF (aesthetics)
**Expertise:** UI/UX, design, first-time experience, product direction  
**Use for:** Design changes, user experience improvements, visual refinements  
**Trigger:** Label issues with `ui`, `ux`, or `design`

### CODE-SENTINEL
**Expertise:** Code quality, TypeScript, testing, bug fixes  
**Use for:** Bugs, quality issues, test failures, code reviews  
**Trigger:** Label issues with `bug`, `quality`, or `testing`

### CONTENT-PIPELINE
**Expertise:** Game templates, content automation, validation  
**Use for:** New templates, content updates, template validation  
**Trigger:** Label issues with `content`, `template`, or `game`

### DEPLOYMENT-GUARDIAN
**Expertise:** Deployment validation, CI/CD, production readiness  
**Use for:** Deployment failures, CI issues, release preparation  
**Trigger:** Label issues with `deployment`, `ci`, or `cd`

---

## 📋 Common Tasks

### Delegate Task to Agent

**Via GitHub Issues:**
1. Create new issue
2. Add appropriate label (see above)
3. Supervisor auto-assigns to agent

**Via Workflow:**
1. Go to **Actions** → **Repository Supervisor - Agent Orchestration**
2. Click **Run workflow**
3. Select agent, describe task, set priority
4. Click **Run workflow**

### Review Stale PRs
```bash
gh pr list --state open
```
Supervisor automatically comments on PRs >24h old with suggested fixes.

### Clean Up Branches
Supervisor automatically creates issues for branches >30 days old.
- Review the list
- Comment `auto-cleanup approved` to authorize deletion

### Check Workflow Status
```bash
gh run list --limit 10
```
View recent workflow runs across all workflows.

### View Agent Task Status
```bash
find .github/agent-tasks -name "*.json" -exec cat {} \;
```
Shows active agent tasks and their status.

---

## ⏰ Automated Schedule

### Every 6 Hours
- Health check runs
- Stale PR detection
- Obsolete branch scan
- Workflow health verification

### On PR Events
- Monitors new PRs
- Tracks PR age
- Checks for merge conflicts
- Validates CI status

### On Issue Labels
- Auto-delegates to appropriate agent
- Creates agent task branch
- Notifies stakeholders

---

## 🚨 Intervention Triggers

### Automatic Intervention
- PR open >24 hours → Comment with guidance
- Branch inactive >30 days → Create cleanup issue
- Workflow fails repeatedly → Investigation report
- Agent task overdue → Escalation issue

### Human Approval Required
- Security vulnerabilities
- Breaking changes
- Production deployments
- Payment logic changes
- Deleting active branches

---

## 📊 Weekly Routine (Recommended)

### Monday (5 min)
- [ ] Run `npm run health`
- [ ] Review any urgent issues
- [ ] Check stale PRs

### Wednesday (5 min)
- [ ] Run `npm run supervisor:status`
- [ ] Verify all agents performing
- [ ] Check deployments

### Friday (10 min)
- [ ] Review weekly metrics
- [ ] Approve branch cleanups
- [ ] Plan next week

---

## 🔧 Troubleshooting

### "Supervisor not running"
**Solution:**
```bash
# Enable the workflow
gh workflow enable repo-supervisor.yml

# Trigger manually
npm run supervisor:check
```

### "Agent task overdue"
**Solution:**
1. Check `.github/agent-tasks/` for details
2. Review task complexity
3. Break into smaller tasks if needed
4. Assign to human developer if stuck

### "Health score dropping"
**Solution:**
1. Run `npm run health` to identify issues
2. Follow specific recommendations
3. Run `npm run supervisor:check` after fixes
4. Verify score improvement

---

## 📈 Metrics to Track

### Daily
- Open PR count
- Average PR age
- Active agent tasks

### Weekly
- PRs merged
- Branches cleaned
- CI success rate
- Health score trend

### Monthly
- Agent task completion rate
- Manual intervention frequency
- Time saved on repo management

---

## 💡 Pro Tips

1. **Trust the Automation** - Let the supervisor handle routine tasks
2. **Check Health Weekly** - 5 minutes keeps you informed
3. **Use Agent Labels** - Quick delegation via issue labels
4. **Read Supervisor Comments** - They contain specific guidance
5. **Review Reports** - Health reports identify trends

---

## 🆘 Need Help?

### For Supervisor Issues
Create issue with label `supervisor-help`:
```bash
gh issue create --title "Supervisor: [your issue]" --label supervisor-help
```

### For Strategic Decisions
Tag `@repo-supervisor` in comments:
```markdown
@repo-supervisor What's the impact of changing the navigation structure?
```

### For Urgent Issues
Use `urgent` label:
```bash
gh issue create --title "[URGENT] [description]" --label urgent
```

---

## 📚 Related Documentation

- [Full Supervisor Guide](./REPOSITORY_SUPERVISOR_GUIDE.md) - Complete non-technical guide
- [Agent Configurations](./.github/agents/) - Detailed agent specs
- [Repo Management Strategy](./REPO_MANAGEMENT_STRATEGY.md) - Overall strategy
- [Command Centre](./COMMAND_CENTRE.md) - Metrics dashboard

---

**Remember:** The supervisor works FOR you, not instead of you. It handles the routine so you can focus on strategy and growth! 🚀
