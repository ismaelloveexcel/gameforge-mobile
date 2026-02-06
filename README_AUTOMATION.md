# GameForge Automation Suite

> One-command setup and configuration for the Unified Ecosystem

---

## 🚀 Quick Start (30 Seconds)

```bash
# 1. Run the interactive setup wizard
npm run setup

# 2. Validate your configuration
npm run validate-config

# 3. Start the app
npm start
```

That's it! The wizard handles everything.

---

## 📋 Available Commands

### Setup & Configuration

```bash
# Interactive setup wizard (recommended)
npm run setup

# Validate existing configuration
npm run validate-config

# Alternative alias
npm run check-config
```

### Firebase Deployment

```bash
# Deploy Firestore security rules
npm run deploy:firebase-rules

# Deploy web app to Firebase Hosting
npm run deploy:firebase
```

### Development

```bash
# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Run tests
npm test

# Check code quality
npm run lint
npx tsc --noEmit
```

---

## 🧙 Setup Wizard

The interactive wizard (`npm run setup`) guides you through:

### Step 1: Firebase Configuration
- Enter 6 Firebase credentials
- Validates format automatically
- Creates `.env` file

### Step 2: Payment Provider
Choose one:
- **PayTabs** (UAE market)
- **Stripe** (International)
- **Skip** (Demo mode)

### Step 3: AI Services (Optional)
- OpenAI API
- Grok API
- Or skip (uses fallback templates)

### Result
- ✅ `.env` file created
- ✅ Configuration validated
- ✅ Ready to run

---

## ✅ Configuration Validator

The validator (`npm run validate-config`) checks:

### Firebase Validation
- All 6 required keys present
- Format validation:
  - Auth domain ends with `.firebaseapp.com`
  - Storage bucket ends with `.appspot.com`
  - Sender ID is numeric
  - App ID has correct format

### Payment Validation
- Detects provider (PayTabs/Stripe/Demo)
- Validates key formats:
  - PayTabs Client Key starts with `C`
  - PayTabs Server Key starts with `S`
  - Stripe key starts with `pk_test_` or `pk_live_`
- Warns if in test mode

### AI Validation
- Checks OpenAI key format (`sk-...`)
- Detects Grok configuration
- Reports fallback mode if none configured

### Output Example

```
╔════════════════════════════════════════════════╗
║      GameForge Configuration Validator         ║
╚════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Firebase (Content Database)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ All Firebase keys present

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Payment Provider
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ PayTabs configured
  ℹ️  Using TEST mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ OpenAI configured

╔════════════════════════════════════════════════╗
║                   Summary                      ║
╚════════════════════════════════════════════════╝

Firebase:  ✅ Ready
Payment:   ✅ PayTabs
AI:        ✅ Ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Configuration is production-ready!
```

---

## 🔐 Firebase Security Rules

### Pre-configured Rules

The `firestore.rules` file includes production-ready security rules for:
- **Featured Games** - Public read, authenticated write
- **Seasonal Drops** - Public read, authenticated write
- **Gift Orders** - Anyone can create, users read their own
- **Gift Memories** - Users access only their own
- **Analytics** - Authenticated read/write
- **Pending Approvals** - Admin access only

### Deploy Rules

#### Method 1: Automated Script (Recommended)
```bash
npm run deploy:firebase-rules
```

The script:
- ✅ Checks if Firebase CLI is installed
- ✅ Creates `firebase.json` if needed
- ✅ Validates rules file exists
- ✅ Deploys to your project

#### Method 2: Manual Deployment
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
```

#### Method 3: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** > **Rules**
4. Copy contents of `firestore.rules`
5. Click **Publish**

---

## 🤖 GitHub Actions Automation

### Configuration Check Workflow

Runs on every push/PR to validate configuration:

```yaml
# .github/workflows/config-check.yml
- Validates .env structure
- Checks TypeScript compilation
- Runs tests
- Reports configuration status
```

**How it works:**
1. Reads secrets from GitHub repository
2. Creates `.env` file from secrets
3. Runs validation script
4. Reports status in PR summary

### Firebase Rules Deployment

Automatically deploys rules when changed:

```yaml
# .github/workflows/deploy-firebase-rules.yml
- Triggers on: firestore.rules changes
- Deploys to Firebase project
- Updates deployment summary
```

**Setup:**
```bash
# 1. Generate Firebase CI token
firebase login:ci

# 2. Add secrets to GitHub:
# - FIREBASE_TOKEN (from step 1)
# - FIREBASE_PROJECT_ID (your project ID)
```

---

## 📁 File Structure

```
gameforge-mobile/
├── scripts/
│   ├── setup-wizard.js          # Interactive configuration
│   ├── validate-config.js       # Configuration validator
│   └── deploy-firebase-rules.js # Rules deployment
├── .github/
│   └── workflows/
│       ├── config-check.yml     # Auto-validate config
│       └── deploy-firebase-rules.yml  # Auto-deploy rules
├── firestore.rules              # Security rules (ready to deploy)
├── .env.example                 # Template with instructions
└── .env                         # Your config (git-ignored)
```

---

## 🔧 Environment Variables

### Required for Production

```bash
# Firebase (6 variables)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Optional (Choose One Payment Provider)

```bash
# PayTabs (UAE)
EXPO_PUBLIC_PAYTABS_PROFILE_ID=
EXPO_PUBLIC_PAYTABS_CLIENT_KEY=
EXPO_PUBLIC_PAYTABS_SERVER_KEY=

# OR Stripe (International)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Optional (AI Services)

```bash
# OpenAI
EXPO_PUBLIC_OPENAI_API_KEY=

# Grok
EXPO_PUBLIC_GROK_API_KEY=
```

---

## 🎯 Common Workflows

### First-Time Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd gameforge-mobile

# 2. Install dependencies
npm install

# 3. Run setup wizard
npm run setup

# 4. Validate configuration
npm run validate-config

# 5. Deploy Firebase rules (optional)
npm run deploy:firebase-rules

# 6. Start app
npm start
```

### Adding to Existing Project

```bash
# If you have .env, validate it
npm run validate-config

# If issues found, run wizard
npm run setup

# Deploy rules if needed
npm run deploy:firebase-rules
```

### CI/CD Setup

```bash
# 1. Add secrets to GitHub:
#    - All EXPO_PUBLIC_* variables
#    - FIREBASE_TOKEN (for auto-deploy)
#    - FIREBASE_PROJECT_ID

# 2. Push code
git push origin main

# 3. Workflows run automatically:
#    - Validates configuration
#    - Deploys Firebase rules (if changed)
#    - Reports status in PR
```

---

## 🆘 Troubleshooting

### Setup Wizard Issues

**"Cannot find module readline"**
- Node.js issue - reinstall Node.js

**"Permission denied"**
```bash
chmod +x scripts/*.js
```

### Validation Issues

**"No .env file found"**
```bash
npm run setup
```

**"Firebase keys invalid format"**
- Double-check Firebase console
- Ensure no extra spaces
- Use quotes if values have special chars

### Deployment Issues

**"Firebase CLI not found"**
```bash
npm install -g firebase-tools
```

**"Not authorized"**
```bash
firebase login
firebase use --add  # Select your project
```

---

## 📚 Related Documentation

- **[Quick Setup](../FIREBASE_PAYMENT_SETUP.md)** - 5-minute guide
- **[Full Configuration Guide](./CONFIGURATION_GUIDE.md)** - Complete walkthrough
- **[Unified Ecosystem](../UNIFIED_ECOSYSTEM.md)** - System architecture
- **[.env.example](../.env.example)** - All available options

---

## 🎉 What's Automated

✅ **Setup Wizard**
- Interactive configuration
- Validates inputs
- Creates `.env` file
- Provides next steps

✅ **Configuration Validator**
- Checks all required keys
- Validates formats
- Detects providers
- Reports status

✅ **Firebase Rules Deployment**
- One-command deploy
- Auto-creates firebase.json
- Validates before deploy
- Confirms success

✅ **GitHub Actions**
- Auto-validates on push
- Auto-deploys rules
- PR status reports
- Secret management

✅ **Zero Manual Configuration**
- No need to edit files
- No need to copy/paste
- No need to remember formats
- Just answer questions!

---

**TL;DR:** Run `npm run setup` and answer questions. Everything else is automated! 🚀
