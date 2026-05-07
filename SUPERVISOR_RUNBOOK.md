# Repository Supervisor - Intervention Runbook

> Quick reference for handling common repository issues identified by the supervisor.

## 🚨 PR Issues

### Issue: PR with Merge Conflicts

**Supervisor Detection:**
```
🚨 Repository Supervisor Alert
This PR has been open for 26 hours and has merge conflicts.
```

**Auto-Fix (Simple Conflicts):**
```bash
# 1. Checkout PR branch
gh pr checkout <number>

# 2. Rebase against main
git fetch origin main
git rebase origin/main

# 3. If conflicts are simple (whitespace, formatting):
git add .
git rebase --continue

# 4. Force push (PR branch only)
git push --force-with-lease
```

**Manual Intervention (Complex Conflicts):**
1. Review conflicting files
2. Understand intent of both changes
3. Merge carefully
4. Run tests: `npm test`
5. Verify build: `npm run lint`
6. Push resolution

**Delegate to Agent:**
- For code conflicts → `@code-sentinel`
- For UI conflicts → `@aesthetics`
- For deployment conflicts → `@deployment-guardian`

---

### Issue: PR with Failing CI

**Supervisor Detection:**
```
🚨 Repository Supervisor Alert
This PR has been open for 28 hours with failing CI checks.
```

**Diagnosis:**
```bash
# View failing workflow
gh run view <run-id>

# Download logs
gh run view <run-id> --log > ci-failure.log

# Analyze failure
grep -i "error\|failed" ci-failure.log
```

**Common Fixes:**

**Linting Errors:**
```bash
npm run lint
# Fix auto-fixable issues
npm run lint -- --fix
git add .
git commit -m "fix: Lint errors"
```

**TypeScript Errors:**
```bash
npx tsc --noEmit
# Review and fix type issues
```

**Test Failures:**
```bash
npm test
# Review failing tests
# Fix implementation or update tests
```

**Dependency Issues:**
```bash
npm ci
# If lock file out of sync:
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update package lock"
```

**Delegate to Agent:**
- All code quality issues → `@code-sentinel`

---

### Issue: PR Awaiting Review

**Supervisor Detection:**
```
⏰ Repository Supervisor Notice
This PR has been open for 32 hours and is awaiting review.
```

**Manual Actions:**
1. **Quick review yourself** (if you're familiar with changes)
2. **Request review from expert:**
   ```bash
   gh pr review <number> --request-reviewer @username
   ```
3. **Add to review queue:**
   ```bash
   gh pr edit <number> --add-label "needs-review"
   ```

**Auto-approve if appropriate:**
```bash
# For documentation or minor changes
gh pr review <number> --approve --body "LGTM - minor change"
gh pr merge <number> --squash
```

---

## 🌿 Branch Issues

### Issue: Obsolete Branches Detected

**Supervisor Detection:**
```
Issue created: "🧹 Repository Supervisor: Obsolete Branch Cleanup"
Lists branches inactive >30 days
```

**Verification Process:**
```bash
# 1. Check each branch for unmerged commits
for branch in <branch-list>; do
  echo "Checking $branch..."
  git log origin/main..origin/$branch --oneline
done

# 2. Check for associated PRs
gh pr list --state all --head <branch-name>
```

**Safe Deletion:**
```bash
# Only if:
# - PR is merged
# - OR PR is closed with no valuable changes
# - OR branch is exact duplicate of main

git push origin --delete <branch-name>
```

**Bulk Deletion (with approval):**
```bash
# Get list of merged branches
git branch -r --merged main | grep -v "main\|develop" > merged-branches.txt

# Review list
cat merged-branches.txt

# Delete all
cat merged-branches.txt | xargs -n 1 git push origin --delete
```

**DO NOT DELETE:**
- Active feature branches
- Release branches
- Branches with unmerged valuable work
- Protected branches

---

## ⚙️ Workflow Issues

### Issue: Workflow Repeatedly Failing

**Supervisor Detection:**
```
Found workflows with recent failures in health report
```

**Investigation:**
```bash
# Get failure details
gh run list --workflow=<workflow-name> --status failure --limit 5

# View specific run
gh run view <run-id>

# Check if pattern exists
gh run list --workflow=<workflow-name> --limit 20 --json conclusion | \
  jq '.[] | .conclusion' | sort | uniq -c
```

**Common Causes:**

**1. Flaky Tests**
```bash
# Re-run workflow
gh run rerun <run-id>

# If consistently fails on same test:
# - Review test for timing issues
# - Add retries or increase timeouts
# - Delegate to @code-sentinel
```

**2. External Service Issues**
```bash
# Check service status (Vercel, npm, etc.)
# Wait for resolution
# Re-run after service recovery
```

**3. Configuration Drift**
```bash
# Compare workflow with working version
git diff <last-working-commit> .github/workflows/<workflow>.yml

# Revert if needed
git checkout <last-working-commit> -- .github/workflows/<workflow>.yml
```

**Delegate to Agent:**
- Deployment workflows → `@deployment-guardian`
- Build workflows → `@code-sentinel`

---

## 🤖 Agent Issues

### Issue: Agent Task Overdue (>48h)

**Supervisor Detection:**
```
Issue created: "🚨 Overdue Agent Task: <agent-name>"
```

**Diagnosis:**
```bash
# Check agent task details
cat .github/agent-tasks/delegation-manifest.json

# Check associated issue/PR
gh issue view <issue-number>
```

**Resolution Paths:**

**1. Task Too Large**
```bash
# Break into smaller tasks
gh issue create --title "[Agent] Subtask 1: ..." --label <agent-label>
gh issue create --title "[Agent] Subtask 2: ..." --label <agent-label>

# Close overdue task
gh issue close <overdue-issue> --comment "Split into smaller tasks"
```

**2. Blocked on Information**
```bash
# Provide missing context
gh issue comment <issue-number> --body "Additional context: ..."

# Re-trigger agent
gh workflow run repo-supervisor-agent-orchestration.yml
```

**3. Agent Malfunction**
```bash
# Review agent logs
gh run list --workflow=<agent-workflow> --limit 5

# Check agent configuration
cat .github/agents/<agent-name>.agent.md

# If agent stuck, assign to human
gh issue edit <issue-number> --remove-label <agent-label> --add-label needs-human
```

---

## 📊 Health Score Issues

### Issue: Health Score Below 50

**Supervisor Detection:**
```
🔴 Overall Health Score: 42/100
Status: Needs Attention (immediate action required)
```

**Action Plan:**

**1. Immediate Issues (>10 point impact)**
```bash
# Failed workflows (-10 each)
gh run list --status failure --limit 10
# Fix or re-run each

# Multiple stale PRs (-5 each)
gh pr list --state open
# Review and move forward
```

**2. Quick Wins**
```bash
# Merge ready PRs
gh pr list --state open --json number,statusCheckRollup | \
  jq '.[] | select(.statusCheckRollup[0].state == "SUCCESS") | .number'

# Delete merged branches
git branch -r --merged main | grep -v "main\|develop" | \
  xargs -n 1 git push origin --delete
```

**3. Systematic Cleanup**
- Monday: Address all stale PRs
- Tuesday: Clean obsolete branches  
- Wednesday: Fix failing workflows
- Thursday: Review agent tasks
- Friday: Verify health score >70

---

## 🔐 Security Issues

### Issue: Security Vulnerability Detected

**Supervisor Detection:**
```
🚨 Security vulnerability found in dependencies
```

**Immediate Actions:**
```bash
# Audit dependencies
npm audit

# Review vulnerabilities
npm audit --json | jq '.vulnerabilities'

# Fix automatically if possible
npm audit fix

# Manual fix for major versions
npm update <package> --save
```

**If Vulnerability in Production:**
```bash
# 1. Assess severity
npm audit --production

# 2. Create hotfix branch
git checkout -b hotfix/security-CVE-XXXX

# 3. Fix vulnerability
npm audit fix --force  # Use with caution

# 4. Test thoroughly
npm test
npm run lint

# 5. Emergency deploy
git commit -m "security: Fix CVE-XXXX vulnerability"
gh pr create --title "URGENT: Security Fix CVE-XXXX" --label urgent
```

**Delegate to Agent:**
- All security issues → `@code-sentinel` with `urgent` priority

---

## 📈 Optimization Issues

### Issue: CI/CD Taking Too Long

**Diagnosis:**
```bash
# Check average run time
gh run list --workflow=ci.yml --limit 20 --json createdAt,updatedAt | \
  jq '.[] | (.updatedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)'
```

**Optimizations:**

**1. Parallelize Jobs**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  # Both run in parallel now
```

**2. Cache Dependencies**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

**3. Skip Unnecessary Steps**
```yaml
- name: Build
  if: github.ref == 'refs/heads/main'  # Only on main
```

---

## 🆘 Escalation

### When to Escalate to Human

**Immediate escalation:**
- 🚨 Production is down
- 🚨 Data loss risk
- 🚨 Security breach
- 🚨 Payment system failure
- 🚨 Legal/compliance issue

**Next business day escalation:**
- ⚠️ Health score <30 after fix attempts
- ⚠️ Multiple workflows broken
- ⚠️ All agents overdue
- ⚠️ Repeated failures in same area

**Weekly review escalation:**
- 📋 Architectural decisions needed
- 📋 New feature proposals
- 📋 Major refactoring suggestions
- 📋 Agent configuration changes

### Escalation Format

```markdown
## Escalation Report

**Severity:** [Critical/High/Medium/Low]
**Issue:** [Brief description]
**Impact:** [What's affected]
**Attempted Fixes:** 
1. [What was tried]
2. [Results]

**Recommendation:** [What should be done]

**Context:**
[Links to PRs, issues, logs, etc.]
```

---

## 📚 Additional Resources

- [Supervisor Guide](./REPOSITORY_SUPERVISOR_GUIDE.md) - Full non-technical guide
- [Quick Reference](./SUPERVISOR_QUICK_REF.md) - Common commands
- [Integration Guide](./SUPERVISOR_INTEGRATION_GUIDE.md) - Setup and configuration
- [GitHub Actions Docs](https://docs.github.com/en/actions) - Official documentation

---

**Remember:** The supervisor handles routine tasks. You handle judgment calls. Together, you keep the repository healthy! 🎯
