# GitHub Actions Quick Reference 📋

Quick command reference for working with GitHub Actions deployment.

> **Note:** Commands use `ismaelloveexcel/gameforge-mobile` as the repository. Replace with your repository name if needed.

---

## 🚀 Getting Started

### First-Time Setup

```bash
# 1. Install required CLIs
npm install -g vercel eas-cli gh

# 2. Set up GitHub secrets (see GITHUB_ACTIONS_SETUP.md)
gh secret set VERCEL_TOKEN --repo ismaelloveexcel/gameforge-mobile
gh secret set VERCEL_ORG_ID --body "your-org-id" --repo ismaelloveexcel/gameforge-mobile
gh secret set VERCEL_PROJECT_ID --body "your-project-id" --repo ismaelloveexcel/gameforge-mobile
gh secret set EXPO_TOKEN --repo ismaelloveexcel/gameforge-mobile

# 3. Push to trigger workflows
git push origin main
```

---

## 📝 Common Commands

### Check Workflow Status

```bash
# List all workflow runs
gh run list --repo ismaelloveexcel/gameforge-mobile

# Watch a specific run
gh run watch <run-id> --repo ismaelloveexcel/gameforge-mobile

# View run logs
gh run view <run-id> --log --repo ismaelloveexcel/gameforge-mobile
```

### Trigger Manual Builds

```bash
# Trigger mobile build (Android)
gh workflow run build-mobile.yml \
  --repo ismaelloveexcel/gameforge-mobile \
  --field platform=android \
  --field profile=production

# Trigger mobile build (iOS)
gh workflow run build-mobile.yml \
  --repo ismaelloveexcel/gameforge-mobile \
  --field platform=ios \
  --field profile=production
```

### Manage Secrets

```bash
# List secrets
gh secret list --repo ismaelloveexcel/gameforge-mobile

# Update a secret
gh secret set VERCEL_TOKEN --repo ismaelloveexcel/gameforge-mobile

# Delete a secret
gh secret delete SECRET_NAME --repo ismaelloveexcel/gameforge-mobile
```

---

## 🔄 Workflow Triggers

### Deploy Web (`deploy-web.yml`)

**Automatic triggers:**
- Push to `main` → Production deployment
- Pull request → Preview deployment

**Manual trigger:**
```bash
gh workflow run deploy-web.yml --repo ismaelloveexcel/gameforge-mobile
```

### Build Mobile (`build-mobile.yml`)

**Automatic triggers:**
- Push to `main` (when mobile files change)

**Manual trigger:**
```bash
gh workflow run build-mobile.yml \
  --repo ismaelloveexcel/gameforge-mobile \
  --field platform=android \
  --field profile=preview
```

### CI Checks (`ci.yml`)

**Automatic triggers:**
- Push to `main` or `develop`
- Pull request to `main` or `develop`

---

## 🌐 Deployment URLs

### View Deployments

```bash
# Web deployment status
vercel ls gameforge-mobile

# Mobile build status
eas build:list
```

### Access URLs

- **Web (Production)**: `https://gameforge-mobile.vercel.app`
- **Web (Preview)**: `https://gameforge-mobile-<branch>.vercel.app`
- **GitHub Actions**: `https://github.com/ismaelloveexcel/gameforge-mobile/actions`
- **EAS Builds**: `https://expo.dev/accounts/[username]/projects/gameforge-mobile/builds`

---

## 🐛 Troubleshooting

### Workflow Failed

```bash
# View failure details
gh run view <run-id> --log --repo ismaelloveexcel/gameforge-mobile

# Re-run failed jobs
gh run rerun <run-id> --repo ismaelloveexcel/gameforge-mobile
```

### Check Secret Configuration

```bash
# Verify secrets exist
gh secret list --repo ismaelloveexcel/gameforge-mobile

# Expected output:
# EXPO_TOKEN
# VERCEL_ORG_ID
# VERCEL_PROJECT_ID
# VERCEL_TOKEN
```

### Test Locally

```bash
# Test web build
npm run build:web

# Test linting
npm run lint

# Test TypeScript
npx tsc --noEmit

# Test mobile build locally
eas build --platform android --profile preview --local
```

---

## 📊 Workflow Files

| File | Purpose | Trigger |
|------|---------|---------|
| `deploy-web.yml` | Deploy web to Vercel | Push to main, PR |
| `build-mobile.yml` | Build mobile apps | Push to main, Manual |
| `ci.yml` | Lint & test | Push, PR |

---

## 🔑 Required Secrets

| Secret | Purpose | Get From |
|--------|---------|----------|
| `VERCEL_TOKEN` | Vercel auth | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Organization ID | Vercel project settings |
| `VERCEL_PROJECT_ID` | Project ID | Vercel project settings |
| `EXPO_TOKEN` | Expo auth | [expo.dev → Access Tokens](https://expo.dev) |

---

## 📈 Status Badges

Add to README.md:

```markdown
[![Deploy Web](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/deploy-web.yml)
[![Build Mobile](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/build-mobile.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/build-mobile.yml)
[![CI](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/ci.yml)
```

---

## 📚 Documentation Links

- [GitHub Actions Setup Guide](./GITHUB_ACTIONS_SETUP.md) - Configure secrets
- [GitHub Actions Deployment Guide](./GITHUB_ACTIONS_DEPLOYMENT.md) - Complete reference
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

## 💡 Tips

### Speed Up Workflows

```yaml
# Use caching in your workflow
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Debug Workflows

```yaml
# Add debug step
- name: Debug Info
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Working directory: $(pwd)"
    ls -la
```

### Notifications

Set up notifications in GitHub:
- Settings → Notifications → Actions
- Enable email/mobile notifications for workflow failures

---

**Made with ❤️ for GameForge Mobile**

*Command your deployments.*
