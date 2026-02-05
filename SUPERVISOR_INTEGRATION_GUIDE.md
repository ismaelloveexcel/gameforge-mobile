# Repository Supervisor - Integration & Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- GitHub repository with Actions enabled
- Node.js 18+ installed locally (for health dashboard)
- GitHub CLI (`gh`) installed (optional but recommended)

### Installation Steps

1. **Enable Workflows**
   ```bash
   # If workflows are not auto-enabled, enable them:
   gh workflow enable repo-supervisor.yml
   gh workflow enable repo-supervisor-agent-orchestration.yml
   ```

2. **Test Health Check**
   ```bash
   npm run health
   ```
   You should see a health dashboard output.

3. **Trigger First Run**
   ```bash
   npm run supervisor:check
   ```
   This manually triggers the supervisor for the first time.

4. **Verify It's Working**
   ```bash
   npm run supervisor:status
   ```
   You should see the workflow run in progress or completed.

---

## 🔧 Configuration

### Adjust Check Frequency

Edit `.github/workflows/repo-supervisor.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours (default)
```

**Options:**
- `*/3` = Every 3 hours (more aggressive)
- `*/12` = Twice daily (more relaxed)
- `0 8,20` = At 8 AM and 8 PM only

### Customize Thresholds

**PR Staleness (default: 24 hours):**
```yaml
# In repo-supervisor.yml, find:
select((now - (.createdAt | fromdateiso8601)) > 86400)
```
Change `86400` to:
- `43200` for 12 hours
- `172800` for 48 hours

**Branch Obsolescence (default: 30 days):**
```yaml
# In repo-supervisor.yml, find:
THIRTY_DAYS_AGO=$((CURRENT_TIME - 2592000))
```
Change `2592000` to:
- `1296000` for 15 days
- `5184000` for 60 days

### Agent Label Mapping

Edit `.github/workflows/repo-supervisor-agent-orchestration.yml`:

```yaml
if echo "$LABELS" | grep -q "ui\|ux\|design"; then
  AGENT="aesthetics"
```

Add custom mappings:
```yaml
elif echo "$LABELS" | grep -q "security"; then
  AGENT="code-sentinel"
elif echo "$LABELS" | grep -q "performance"; then
  AGENT="code-sentinel"
```

---

## 🔗 Integration with Existing Agents

### FORGE-CHIEF (aesthetics)
**Location:** `.github/agents/aesthetics.agent.md`

**Integration:**
- Supervisor delegates UI/UX tasks automatically
- Monitors design consistency
- Escalates if design breaks user experience

**Example Delegation:**
```bash
# Create issue with label
gh issue create --title "Improve gift wizard UX" --label design
# Supervisor auto-assigns to FORGE-CHIEF
```

### CODE-SENTINEL
**Location:** `.github/agents/code-sentinel.agent.md`

**Integration:**
- Supervisor delegates code quality issues
- Runs after CI failures
- Validates test coverage

**Example Delegation:**
```bash
gh issue create --title "Fix failing tests" --label testing
# Supervisor auto-assigns to CODE-SENTINEL
```

### CONTENT-PIPELINE
**Location:** `.github/agents/content-pipeline.agent.md`

**Integration:**
- Supervisor delegates template work
- Monitors content quality
- Validates game templates

**Example Delegation:**
```bash
gh issue create --title "Create Valentine's template" --label content
# Supervisor auto-assigns to CONTENT-PIPELINE
```

### DEPLOYMENT-GUARDIAN
**Location:** `.github/agents/deployment-guardian.agent.md`

**Integration:**
- Supervisor delegates deployment issues
- Monitors CI/CD health
- Pre-deployment validation

**Example Delegation:**
```bash
gh issue create --title "Fix Vercel deployment" --label deployment
# Supervisor auto-assigns to DEPLOYMENT-GUARDIAN
```

---

## 📊 Monitoring & Alerts

### GitHub Notifications

**Configure notification rules:**
1. Go to **Settings** → **Notifications**
2. Enable **Actions** notifications
3. Set up email or Slack integration

**Recommended settings:**
- ✅ Notify on workflow failures
- ✅ Notify on new issues (with `urgent` label)
- ⚠️ Don't notify on every run (too noisy)

### Health Report Artifacts

Supervisor uploads health reports as artifacts:
1. Go to **Actions** → **Repository Supervisor**
2. Click on any run
3. Download `repo-health-report-XXX` artifact
4. View detailed report

**Retention:** 30 days (configurable in workflow)

### Custom Alerts

Add Slack/Discord webhook:

```yaml
# Add to repo-supervisor.yml after health check
- name: Send Slack notification
  if: steps.check-prs.outputs.stale_count > 5
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
      -H 'Content-Type: application/json' \
      -d '{"text":"⚠️ Repository health alert: 5+ stale PRs detected"}'
```

---

## 🎯 Workflow Integration

### Add to Existing CI

Integrate health checks into your existing CI:

```yaml
# In .github/workflows/ci.yml
jobs:
  lint-and-test:
    # ... existing job ...
    
  health-check:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run health
```

### Pre-Merge Validation

Require supervisor approval before merging:

```yaml
# In .github/workflows/pr-validation.yml
name: PR Validation
on: pull_request

jobs:
  supervisor-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check PR health
        run: |
          PR_AGE_HOURS=$(( ($(date +%s) - $(date -d "${{ github.event.pull_request.created_at }}" +%s)) / 3600 ))
          if [ $PR_AGE_HOURS -lt 24 ]; then
            echo "✅ PR is fresh (${PR_AGE_HOURS}h old)"
          else
            echo "⚠️ PR is stale (${PR_AGE_HOURS}h old)"
            exit 1
          fi
```

### Post-Deploy Validation

Run supervisor after deployments:

```yaml
# In .github/workflows/deploy-web.yml
- name: Trigger supervisor check
  if: success()
  run: |
    gh workflow run repo-supervisor.yml
```

---

## 🧪 Testing the Supervisor

### Test Stale PR Detection

1. Create a test PR:
   ```bash
   git checkout -b test/stale-pr
   echo "test" > test.txt
   git add test.txt
   git commit -m "Test stale PR"
   git push origin test/stale-pr
   gh pr create --title "Test: Stale PR Detection" --body "Testing supervisor"
   ```

2. Wait 24 hours OR manually test:
   ```bash
   # Temporarily modify the threshold in workflow
   # Change 86400 to 60 (1 minute)
   # Commit and push
   # Wait 2 minutes
   # Run: npm run supervisor:check
   ```

3. Check PR for supervisor comment

### Test Branch Cleanup

1. Create old test branch:
   ```bash
   git checkout -b test/old-branch
   git push origin test/old-branch
   ```

2. Manually test:
   ```bash
   # Temporarily modify threshold in workflow
   # Change 2592000 to 60 (1 minute)
   # Wait and trigger: npm run supervisor:check
   ```

3. Check for cleanup issue created

### Test Agent Delegation

1. Create test issue:
   ```bash
   gh issue create \
     --title "Test: Agent Delegation" \
     --body "Testing automatic agent delegation" \
     --label design
   ```

2. Check Actions tab for orchestration workflow

3. Verify agent task created in `.github/agent-tasks/`

---

## 🔐 Security Considerations

### Required Permissions

The supervisor needs:
- ✅ `contents: write` - To manage branches
- ✅ `pull-requests: write` - To comment on PRs
- ✅ `issues: write` - To create/update issues

These are configured in workflow files.

### Secrets Management

**No secrets required for basic operation!**

Optional secrets for enhancements:
- `SLACK_WEBHOOK_URL` - For Slack notifications
- `DISCORD_WEBHOOK_URL` - For Discord notifications

**Never expose:**
- Personal access tokens in workflows
- API keys in public repos
- Deployment credentials

### Branch Protection

Recommended branch protection rules:

```yaml
main:
  - Require PR before merge
  - Require status checks to pass
  - Require review from code owners
  - Allow supervisor to bypass (optional)
```

---

## 📈 Performance Optimization

### Reduce GitHub Actions Minutes

**Current usage:** ~5 minutes per run × 4 runs/day = 20 min/day = 600 min/month

**Optimizations:**
1. **Adjust frequency:** 12-hour checks = 10 min/day = 300 min/month
2. **Conditional runs:** Skip if no PRs open
3. **Parallel jobs:** Split checks into concurrent jobs

### Optimize Script Performance

**Cache dependencies:**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**Skip unnecessary steps:**
```yaml
- name: Check PRs
  if: github.event_name == 'pull_request'
  # Only run on PR events
```

---

## 🐛 Troubleshooting

### "Workflow not running automatically"

**Check:**
1. Workflow is enabled: `gh workflow list`
2. Cron schedule is valid: Use [crontab.guru](https://crontab.guru)
3. Actions are enabled for repo

**Fix:**
```bash
gh workflow enable repo-supervisor.yml
```

### "Permission denied errors"

**Check:**
1. Workflow has correct permissions in YAML
2. Repository settings allow Actions to write

**Fix:**
```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
```

### "Health dashboard not working"

**Check:**
1. Node.js installed: `node --version`
2. GitHub CLI installed: `gh --version`
3. Authenticated: `gh auth status`

**Fix:**
```bash
npm install  # Install dependencies
gh auth login  # Authenticate with GitHub
```

### "Agent tasks not delegating"

**Check:**
1. Labels are correctly configured
2. Agent orchestration workflow is enabled
3. Issue has matching label

**Fix:**
```bash
# Manually trigger orchestration
gh workflow run repo-supervisor-agent-orchestration.yml
```

---

## 🆕 Adding Custom Checks

### Add Custom Health Metric

In `repo-supervisor.yml`:

```yaml
- name: Check custom metric
  id: custom-check
  run: |
    # Your custom check here
    CUSTOM_METRIC=$(your-command)
    echo "custom_metric=$CUSTOM_METRIC" >> $GITHUB_OUTPUT

- name: Update health score
  run: |
    # Incorporate into health score
    HEALTH_SCORE=$((HEALTH_SCORE - ${{ steps.custom-check.outputs.custom_metric }}))
```

### Add Custom Agent

1. Create agent config: `.github/agents/my-agent.agent.md`
2. Add to orchestration workflow:
   ```yaml
   elif echo "$LABELS" | grep -q "my-label"; then
     AGENT="my-agent"
   ```
3. Create corresponding workflow or integration

---

## 📚 Advanced Usage

### Supervisor API Calls

Access supervisor data programmatically:

```javascript
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Get latest health report
const { data: runs } = await octokit.actions.listWorkflowRuns({
  owner: 'ismaelloveexcel',
  repo: 'gameforge-mobile',
  workflow_id: 'repo-supervisor.yml',
  per_page: 1
});

// Download artifact
const artifacts = await octokit.actions.listWorkflowRunArtifacts({
  owner: 'ismaelloveexcel',
  repo: 'gameforge-mobile',
  run_id: runs.workflow_runs[0].id
});
```

### Custom Supervisor Dashboard

Build a web dashboard:

```javascript
// pages/supervisor-dashboard.js
export default function Dashboard() {
  const [health, setHealth] = useState(null);
  
  useEffect(() => {
    fetch('/api/supervisor-health')
      .then(res => res.json())
      .then(setHealth);
  }, []);
  
  return (
    <div>
      <h1>Repository Health: {health?.score}/100</h1>
      {/* Render health data */}
    </div>
  );
}
```

---

## ✅ Post-Setup Checklist

After setup, verify:

- [ ] Health dashboard works: `npm run health`
- [ ] Supervisor workflow enabled and running
- [ ] Agent orchestration workflow enabled
- [ ] Test issue with label triggers agent
- [ ] Health reports generated in Actions
- [ ] Notifications configured (optional)
- [ ] Team trained on using supervisor
- [ ] Documentation read and understood

---

## 🎉 Success Criteria

You'll know the supervisor is working when:

1. **PRs get automatic attention** - Comments appear on stale PRs
2. **Branches get cleaned** - Issues created for obsolete branches
3. **Agents get work** - Tasks automatically delegated
4. **Reports are generated** - Health artifacts in Actions
5. **Time is saved** - Less manual repo management needed

**Expected time savings:** 80% reduction in manual repo work (from ~5h/week to ~1h/week)

---

**Questions or issues?** Create an issue with label `supervisor-help`
