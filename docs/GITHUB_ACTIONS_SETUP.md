# GitHub Actions Setup Guide - Secrets Configuration 🔐

This guide walks you through configuring the necessary secrets for automated deployment with GitHub Actions.

---

## 📋 Prerequisites

Before setting up secrets, you need accounts on:

1. **GitHub** (you already have this)
2. **Vercel** (for web deployment) - [Sign up free](https://vercel.com/signup)
3. **Expo** (for mobile builds) - [Sign up free](https://expo.dev/signup)

---

## 🔑 Required Secrets

Your GitHub repository needs the following secrets configured:

| Secret Name | Description | Provider |
|-------------|-------------|----------|
| `VERCEL_TOKEN` | Vercel authentication token | Vercel |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Vercel |
| `VERCEL_PROJECT_ID` | Your project ID in Vercel | Vercel |
| `EXPO_TOKEN` | Expo authentication token | Expo |

---

## 🌐 Part 1: Vercel Secrets

### Step 1: Create Vercel Account

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 2: Import Your Project

1. Click "Add New..." → "Project"
2. Find and import `gameforge-mobile` repository
3. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `web-build`
   - **Install Command**: `npm install`
4. Click "Deploy" (this first deployment will establish the project)

### Step 3: Get Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it: `GitHub Actions - GameForge`
4. Scope: Select your account/team
5. Expiration: Never (or set custom duration)
6. Click "Create Token"
7. **Copy the token immediately** (you won't see it again!)

### Step 4: Get Project IDs

1. Go to your project in Vercel dashboard
2. Click "Settings"
3. Under "General", find:
   - **Project ID** - Copy this value
   - Scroll down to find **Organization ID** (or Team ID) - Copy this value

### Step 5: Add Secrets to GitHub

**Option A: Using GitHub Web Interface**

1. Go to your repo: `https://github.com/ismaelloveexcel/gameforge-mobile`
2. Click "Settings" tab
3. In left sidebar: "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret:
   - Name: `VERCEL_TOKEN`, Value: [paste token]
   - Name: `VERCEL_ORG_ID`, Value: [paste org ID]
   - Name: `VERCEL_PROJECT_ID`, Value: [paste project ID]

**Option B: Using GitHub CLI**

```bash
# Install GitHub CLI if needed
# macOS: brew install gh
# Windows: winget install GitHub.cli
# Linux: See https://github.com/cli/cli#installation

# Authenticate
gh auth login

# Set secrets (replace values with your actual credentials)
gh secret set VERCEL_TOKEN --repo ismaelloveexcel/gameforge-mobile
# When prompted, paste your Vercel token

gh secret set VERCEL_ORG_ID --body "your-org-id-here" --repo ismaelloveexcel/gameforge-mobile

gh secret set VERCEL_PROJECT_ID --body "your-project-id-here" --repo ismaelloveexcel/gameforge-mobile
```

---

## 📱 Part 2: Expo Secrets

### Step 1: Create Expo Account

1. Go to [expo.dev/signup](https://expo.dev/signup)
2. Sign up with email or GitHub
3. Verify your email address

### Step 2: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 3: Login to Expo

```bash
eas login
```

Enter your Expo credentials when prompted.

### Step 4: Link Your Project

```bash
cd /path/to/gameforge-mobile
eas build:configure
```

This ensures your project is linked to your Expo account.

### Step 5: Generate Access Token

**Option A: Via Web Interface**

1. Go to [expo.dev](https://expo.dev)
2. Click your profile icon → "Access Tokens"
3. Or direct link: `https://expo.dev/accounts/[your-username]/settings/access-tokens`
4. Click "Create Token"
5. Name it: `GitHub Actions - GameForge`
6. Select scope: `Full access` (or customize as needed)
7. Click "Create Token"
8. **Copy the token immediately** (you won't see it again!)

**Option B: Via CLI**

```bash
# Get your username first
eas whoami

# Then visit the access tokens page
# https://expo.dev/accounts/[your-username]/settings/access-tokens
```

### Step 6: Add Expo Token to GitHub

**Option A: Using GitHub Web Interface**

1. Go to your repo: `https://github.com/ismaelloveexcel/gameforge-mobile`
2. Click "Settings" tab
3. In left sidebar: "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `EXPO_TOKEN`
6. Value: [paste your Expo access token]
7. Click "Add secret"

**Option B: Using GitHub CLI**

```bash
gh secret set EXPO_TOKEN --repo ismaelloveexcel/gameforge-mobile
# When prompted, paste your Expo token
```

---

## ✅ Verification

### Check Secrets are Set

**Via GitHub CLI:**
```bash
gh secret list --repo ismaelloveexcel/gameforge-mobile
```

You should see:
```
EXPO_TOKEN          Updated 2024-01-XX
VERCEL_ORG_ID       Updated 2024-01-XX
VERCEL_PROJECT_ID   Updated 2024-01-XX
VERCEL_TOKEN        Updated 2024-01-XX
```

**Via GitHub Web:**
1. Go to repo Settings → Secrets and variables → Actions
2. You should see all 4 secrets listed (values are hidden)

### Test the Workflows

**Trigger a deployment:**

```bash
# Make a small change (e.g., update README)
echo "# Testing deployment" >> README.md
git add README.md
git commit -m "test: trigger deployment"
git push origin main
```

**Monitor progress:**
1. Go to `https://github.com/ismaelloveexcel/gameforge-mobile/actions`
2. You should see workflows running:
   - "Deploy Web to Vercel"
   - "CI - Lint and Test"
3. Click on a workflow to see detailed logs

---

## 🔒 Security Best Practices

### Token Security

- ✅ **Never commit tokens** to your repository
- ✅ **Use repository secrets** for sensitive data
- ✅ **Rotate tokens periodically** (every 6-12 months)
- ✅ **Use minimal permissions** when creating tokens
- ✅ **Delete unused tokens** immediately

### Revoking Tokens

**Vercel Token:**
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Find the token
3. Click "..." → "Delete"

**Expo Token:**
1. Go to [expo.dev](https://expo.dev) → Access Tokens
2. Find the token
3. Click "Revoke"

Then create a new token and update the GitHub secret.

---

## 🆘 Troubleshooting

### Issue: "Secret not found" error in workflow

**Solution:**
- Verify secret names are EXACTLY as specified (case-sensitive)
- Check you added secrets to the correct repository
- Ensure secrets are in "Actions" section, not "Dependabot"

### Issue: "Invalid Vercel token"

**Solution:**
1. Generate a new token at [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Update the secret in GitHub:
   ```bash
   gh secret set VERCEL_TOKEN --repo ismaelloveexcel/gameforge-mobile
   ```

### Issue: "Expo authentication failed"

**Solution:**
1. Verify token is still valid at [expo.dev](https://expo.dev) → Access Tokens
2. If expired, create new token
3. Update GitHub secret:
   ```bash
   gh secret set EXPO_TOKEN --repo ismaelloveexcel/gameforge-mobile
   ```

### Issue: Can't find Vercel Project/Org ID

**Solution:**
1. Go to project settings in Vercel
2. Scroll to "General" section
3. IDs are displayed at the top
4. They look like: `prj_xxxxxxxxxxxx` and `team_xxxxxxxxxxxx`

---

## 📚 Additional Resources

### Official Documentation
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel Token Management](https://vercel.com/docs/rest-api#creating-an-access-token)
- [Expo Access Tokens](https://docs.expo.dev/accounts/programmatic-access/)

### Video Guides
- [GitHub Actions Secrets Tutorial](https://www.youtube.com/results?search_query=github+actions+secrets)
- [Vercel Deployment Setup](https://www.youtube.com/results?search_query=vercel+github+actions)

---

## ✨ Next Steps

Once secrets are configured:

1. ✅ Push code to `main` branch to trigger automated deployment
2. ✅ Check Actions tab to monitor workflows
3. ✅ Access deployed web app at Vercel URL
4. ✅ Download mobile builds from EAS dashboard
5. ✅ Set up status badges in README (already done!)

---

**Made with ❤️ for GameForge Mobile**

*Secure your secrets, automate your deployments.*
