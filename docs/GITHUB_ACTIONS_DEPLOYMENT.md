# Automated Deployment with GitHub Actions 🚀

## Overview

GameForge Mobile uses **GitHub Actions** as the free portal for automated deployment within GitHub. This provides CI/CD automation for:

- ✅ **Web Deployment** - Automatic deployment to Vercel
- ✅ **Mobile Builds** - Automatic EAS builds for Android/iOS
- ✅ **Quality Checks** - Automated linting and testing
- ✅ **100% Free** - GitHub Actions is free for public repositories

---

## 🎯 Automated Workflows

### 1. Web Deployment (`deploy-web.yml`)

**Triggers:**
- Every push to `main` branch → Production deployment
- Every pull request → Preview deployment

**What it does:**
1. Checks out code
2. Sets up Node.js 20
3. Installs dependencies
4. Builds web app with `npm run build:web`
5. Deploys to Vercel automatically

**Status:** Deploys to `https://gameforge-mobile.vercel.app`

### 2. Mobile Builds (`build-mobile.yml`)

**Triggers:**
- Push to `main` branch (when mobile code changes)
- Manual trigger via GitHub Actions UI

**What it does:**
1. Checks out code
2. Sets up Node.js and Expo/EAS
3. Installs dependencies
4. Builds Android APK (or iOS) using EAS
5. Notifies via email when build completes

**Platforms:**
- Android (Free)
- iOS (Requires Apple Developer account)

**Profiles:**
- `development` - Internal testing
- `preview` - Beta testing
- `production` - App store release

### 3. CI Checks (`ci.yml`)

**Triggers:**
- Every push to `main` or `develop`
- Every pull request

**What it does:**
1. Runs ESLint for code quality
2. Runs tests with Jest
3. Type checks with TypeScript
4. Reports results in PR

---

## 🔧 Setup Instructions

### Prerequisites

You need to configure the following secrets in your GitHub repository:

#### For Web Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and log in
2. Create a new project from your GitHub repo
3. Get your credentials:
   - **VERCEL_TOKEN**: Settings → Tokens → Create Token
   - **VERCEL_ORG_ID**: Project Settings → General → Organization ID
   - **VERCEL_PROJECT_ID**: Project Settings → General → Project ID

4. Add secrets to GitHub:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add each secret:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

#### For Mobile Builds (EAS)

1. Sign up for Expo account at [expo.dev](https://expo.dev)
2. Generate access token:
   ```bash
   eas login
   eas whoami
   # Visit: https://expo.dev/accounts/[your-username]/settings/access-tokens
   ```
3. Create a token with "Full access" permission
4. Add to GitHub secrets:
   - Secret name: `EXPO_TOKEN`
   - Value: Your access token

### Quick Setup Steps

```bash
# 1. Install GitHub CLI (if not already installed)
gh auth login

# 2. Set secrets (replace with your actual values)
gh secret set VERCEL_TOKEN --body "your-vercel-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"
gh secret set EXPO_TOKEN --body "your-expo-token"

# 3. Push changes to trigger workflows
git push origin main
```

---

## 📱 Manual Deployment (Fallback)

If you prefer manual deployment or need to test locally:

### Web Deployment
```bash
# Build and deploy to Vercel
npm run build:web
vercel --prod
```

### Mobile Deployment
```bash
# Android APK
eas build --platform android --profile production

# iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

---

## 🎮 Using the Workflows

### Automatic Deployments

**Web:**
1. Push code to `main` branch
2. GitHub Actions automatically builds and deploys
3. Check workflow progress at: `https://github.com/ismaelloveexcel/gameforge-mobile/actions`
4. Get deployment URL in workflow logs

**Mobile:**
1. Push mobile code changes to `main`
2. GitHub Actions triggers EAS build
3. Monitor build at [EAS Dashboard](https://expo.dev/accounts/[username]/projects/gameforge-mobile/builds)
4. Download APK when build completes

### Manual Triggers

**For Mobile Builds:**
1. Go to Actions tab on GitHub
2. Select "Build Mobile App with EAS"
3. Click "Run workflow"
4. Choose:
   - Platform: `android`, `ios`, or `all`
   - Profile: `development`, `preview`, or `production`
5. Click "Run workflow"

---

## 📊 Workflow Status Badges

Add these badges to your README to show deployment status:

```markdown
[![Deploy Web](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/deploy-web.yml)

[![Build Mobile](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/build-mobile.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/build-mobile.yml)

[![CI](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/ismaelloveexcel/gameforge-mobile/actions/workflows/ci.yml)
```

---

## 🔍 Monitoring Deployments

### Web Deployment Status
- **GitHub Actions**: `https://github.com/ismaelloveexcel/gameforge-mobile/actions`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **Live Site**: `https://gameforge-mobile.vercel.app`

### Mobile Build Status
- **GitHub Actions**: `https://github.com/ismaelloveexcel/gameforge-mobile/actions`
- **EAS Dashboard**: `https://expo.dev/accounts/[username]/projects/gameforge-mobile/builds`
- **Build Notifications**: Email from Expo

### CI Check Status
- **Pull Request Checks**: Automatically displayed on PRs
- **GitHub Actions**: `https://github.com/ismaelloveexcel/gameforge-mobile/actions`

---

## 🆘 Troubleshooting

### Issue: Workflow fails with "Secret not found"

**Solution:** Ensure all required secrets are configured in GitHub:
```bash
# Check configured secrets (names only, not values)
gh secret list

# Add missing secrets
gh secret set VERCEL_TOKEN
gh secret set EXPO_TOKEN
```

### Issue: "VERCEL_TOKEN is not valid"

**Solution:** 
1. Generate new token at [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Update GitHub secret:
   ```bash
   gh secret set VERCEL_TOKEN --body "new-token-here"
   ```

### Issue: "EAS build failed"

**Solution:** Check EAS logs:
1. Go to [EAS Dashboard](https://expo.dev)
2. Find your build
3. View detailed logs
4. Common fixes:
   - Update `app.json` configuration
   - Check `eas.json` profiles
   - Verify dependencies in `package.json`

### Issue: "Build out of memory"

**Solution:** Already configured in workflows:
```yaml
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
```

If still failing, increase to `6144` or `8192`.

### Issue: Workflow not triggering

**Solution:**
1. Check workflow file syntax: `https://www.yamllint.com/`
2. Ensure workflows are in `.github/workflows/` directory
3. Check branch protection rules
4. Verify workflow triggers match your branch names

---

## 💰 Cost Analysis

### GitHub Actions (Free Tier)

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| Build minutes | 2,000 min/month | For public repos: **Unlimited** ✨ |
| Storage | 500 MB | Build artifacts |
| Concurrent jobs | 20 | Runs workflows in parallel |

**For this project:** 100% FREE (public repository)

### Vercel (Free Tier)

| Resource | Free Tier |
|----------|-----------|
| Bandwidth | 100 GB/month |
| Build minutes | 6,000 min/month |
| Deployments | Unlimited |
| Projects | Unlimited |
| Team members | 1 |

**Cost:** $0/month

### Expo EAS (Free Tier)

| Resource | Free Tier |
|----------|-----------|
| Build time | Priority builds (paid) or slower free builds |
| Android builds | Free (slower) |
| iOS builds | Free (slower) |
| Storage | 15 GB |

**Cost:** $0/month for basic usage

### Total Cost: $0/month 🎉

---

## 🚀 Advanced Configuration

### Custom Domain for Web

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add custom domain
   - Configure DNS records

2. **Update workflow** (optional):
   ```yaml
   vercel-args: '--prod --alias=yourdomain.com'
   ```

### Build Notifications

Add Slack/Discord notifications:

```yaml
- name: Notify on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    text: 'Deployment successful! 🎉'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Scheduled Builds

Add cron schedule to mobile builds:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday at midnight
```

---

## 📚 Additional Resources

### Official Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/deployments/git/vercel-for-github)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [GitHub Actions for Expo](https://github.com/expo/expo-github-action)

### Helpful Guides
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [EAS Build from CI](https://docs.expo.dev/build/building-on-ci/)

---

## 🎯 Summary

**Free Portal Identified:** GitHub Actions

**What You Get:**
- ✅ Automated web deployments to Vercel
- ✅ Automated mobile builds with EAS
- ✅ Continuous integration (linting/testing)
- ✅ Pull request previews
- ✅ Status badges
- ✅ Build notifications
- ✅ 100% free for public repositories

**Next Steps:**
1. Configure secrets in GitHub
2. Push code to `main` branch
3. Watch automated deployments in Actions tab
4. Share deployment URLs with users

---

**Made with ❤️ for GameForge Mobile**

*Automate once, deploy everywhere.*
