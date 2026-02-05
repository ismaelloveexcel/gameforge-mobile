# GameForge Configuration Guide

> Step-by-step setup for Firebase and Payment providers

---

## Prerequisites

Before you begin, make sure you have:
- Node.js installed (v16 or higher)
- GameForge repository cloned
- Access to create accounts on Firebase and payment platforms

---

## Part 1: Firebase Setup (Required)

Firebase powers the Unified Ecosystem - the shared content database that syncs games between agents and users.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** (or use an existing one)
3. Enter project name: `gameforge-production` (or your choice)
4. Enable/disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose mode:
   - **Production mode** (recommended - we'll configure rules later)
   - **Test mode** (only for development)
4. Select region:
   - **asia-south1** (Mumbai - closest to UAE)
   - Or your preferred region
5. Click **"Enable"**

### Step 3: Set Firestore Security Rules

After creating the database, set these security rules:

1. Go to **Firestore Database** > **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Featured games - readable by all, writable by agents
    match /featured_games/{gameId} {
      allow read: if true;
      allow write: if request.auth != null; // Add agent authentication later
    }
    
    // Seasonal drops - readable by all
    match /seasonal_drops/{dropId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Gift orders - users can create and read their own
    match /gift_orders/{orderId} {
      allow create: if true; // Anyone can create a gift
      allow read: if request.auth != null || resource.data.userId == request.auth.uid;
      allow update: if request.auth != null; // Payment system updates
    }
    
    // Gift memories - users can read/write their own
    match /gift_memories/{memoryId} {
      allow read, write: if request.auth != null && 
        memoryId.matches('^' + request.auth.uid + '_.*');
    }
    
    // Analytics - agents can write, admins can read
    match /analytics/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Pending approvals - agents write, admins read/update
    match /pending_approvals/{approvalId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 4: Get Firebase Config

1. Click the **⚙️ gear icon** next to "Project Overview"
2. Select **"Project settings"**
3. Scroll to **"Your apps"** section
4. If you don't have a web app yet:
   - Click **"Add app"** > Choose **"</>"** (Web)
   - Enter app nickname: `GameForge Mobile`
   - Don't check "Set up Firebase Hosting" (we use Vercel)
   - Click **"Register app"**
5. Copy the `firebaseConfig` object
6. Add these values to your `.env` file:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=gameforge-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=gameforge-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=gameforge-xxxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 5: Initialize Collections (Optional)

For testing, you can manually add sample data:

1. Go to **Firestore Database** > **Data** tab
2. Click **"Start collection"**
3. Collection ID: `featured_games`
4. Add a test document with these fields:

```json
{
  "name": "Birthday Bash",
  "tagline": "The ultimate birthday celebration",
  "description": "A fun party game",
  "thumbnail": "assets/games/birthday-bash.png",
  "tier": "free",
  "priceAED": 0,
  "category": "classic",
  "occasion": "birthday",
  "status": "live",
  "stats": {
    "gifted": 42,
    "avgRating": 4.7,
    "trending": true
  },
  "personalization": {
    "recipientName": true,
    "senderName": true,
    "customMessage": true
  },
  "previewUrl": "",
  "duration": "5-7 min",
  "createdBy": "internal",
  "createdAt": [current timestamp]
}
```

---

## Part 2: Payment Provider Setup

Choose **ONE** payment provider based on your market.

---

## Option A: PayTabs (Recommended for UAE)

PayTabs is optimized for the Middle East market with full AED support.

### Why PayTabs?
- ✅ Full UAE licensing and compliance
- ✅ Native AED support (no conversion fees)
- ✅ Local payment methods: Mada, STC Pay, Apple Pay
- ✅ Lower fees for regional transactions
- ✅ Arabic language support

### Step 1: Create PayTabs Account

1. Go to [PayTabs](https://site.paytabs.com)
2. Click **"Sign Up"** (top right)
3. Choose **"Merchant Account"**
4. Fill in business details:
   - Business name
   - Contact information
   - Business type
   - Expected monthly volume

### Step 2: Complete Verification (KYB)

PayTabs requires business verification:

1. **Documents needed:**
   - Trade license (for UAE businesses)
   - Emirates ID of owner
   - Business bank account details
   - MOA (Memorandum of Association) if applicable

2. **Verification time:** 2-5 business days

3. **Meanwhile:** You can use **Sandbox/Test mode**

### Step 3: Get API Credentials

#### Test/Sandbox Credentials (for development):

1. Login to [PayTabs Dashboard](https://secure.paytabs.com/merchant/login)
2. Click **"Developers"** in the left menu
3. Go to **"API Keys"** section
4. You'll see:
   - **Profile ID** (e.g., `12345`)
   - **Server Key** (e.g., `SBJN...`)
   - **Client Key** (e.g., `CBKN...`)

5. Add to your `.env`:

```bash
EXPO_PUBLIC_PAYTABS_PROFILE_ID=12345
EXPO_PUBLIC_PAYTABS_SERVER_KEY=SBJN-your-server-key-here
EXPO_PUBLIC_PAYTABS_CLIENT_KEY=CBKN-your-client-key-here
```

#### Production Credentials:

After verification is complete:
1. Switch to **Production** mode in dashboard
2. Get new production API keys
3. Update your `.env` with production keys
4. Deploy with production keys as secrets

### Step 4: Test the Integration

**Test Cards (Sandbox mode):**

| Card Number | CVV | Expiry | Expected Result |
|-------------|-----|--------|-----------------|
| 4111 1111 1111 1111 | 123 | Any future | Success |
| 4000 0000 0000 0002 | 123 | Any future | Declined |
| 5200 0000 0000 1096 | 123 | Any future | 3D Secure flow |

**Test Flow:**
1. Create a gift with a paid game (AED 15)
2. Payment sheet should open
3. Enter test card details
4. Payment should process successfully
5. Gift link should be generated

### Step 5: Go Live

1. Complete KYB verification
2. Get production API keys
3. Update environment variables
4. Test with real card (small amount first)
5. Monitor transactions in PayTabs dashboard

---

## Option B: Stripe (Alternative/International)

Use Stripe for international markets or as a fallback.

### Why Stripe?
- ✅ Global payment support
- ✅ Easy integration
- ✅ Excellent documentation
- ⚠️ Limited UAE support (no Mada, no STC Pay)
- ⚠️ Higher fees for AED transactions

### Step 1: Create Stripe Account

1. Go to [Stripe](https://stripe.com)
2. Click **"Sign up"**
3. Enter email and create password
4. Complete business profile

### Step 2: Get API Key

#### Test Mode (for development):

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure **"Test mode"** toggle is ON (top right)
3. Click **"Developers"** > **"API keys"**
4. Copy **"Publishable key"** (starts with `pk_test_...`)
5. Add to your `.env`:

```bash
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Production Mode:

1. Complete Stripe account activation
2. Add business details and bank account
3. Switch to **Live mode**
4. Get **"Live publishable key"** (starts with `pk_live_...`)
5. Update environment with production key

### Step 3: Test the Integration

**Test Cards:**

| Card Number | CVV | Expiry | Expected Result |
|-------------|-----|--------|-----------------|
| 4242 4242 4242 4242 | Any 3 digits | Any future | Success |
| 4000 0000 0000 0002 | Any 3 digits | Any future | Declined |
| 4000 0025 0000 3155 | Any 3 digits | Any future | 3D Secure flow |

### Step 4: Configure Currency

For AED support in Stripe:
1. Go to **Settings** > **Payment methods**
2. Enable payment methods that support AED
3. Note: Stripe converts to USD then to AED (fees apply)

---

## Part 3: Environment Configuration

### Create .env File

1. Copy the example file:

```bash
cp .env.example .env
```

2. Fill in your credentials from above steps

### Verify Configuration

Run this command to test your setup:

```bash
npm start
```

Check console output:
- ✅ "Firebase initialized" - Firebase is working
- ✅ "PayTabs initialized with profile: XXXXX" - PayTabs is working
- ✅ "Stripe initialized" - Stripe is working
- ⚠️ "Payment service running in DEMO mode" - No payment provider configured

---

## Part 4: Deployment Secrets

### GitHub Actions

1. Go to your repository **Settings** > **Secrets and variables** > **Actions**
2. Click **"New repository secret"**
3. Add each environment variable:
   - Name: `EXPO_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSy...`
   - Repeat for all variables

### Vercel

1. Go to your project **Settings** > **Environment Variables**
2. Add each variable:
   - Key: `EXPO_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSy...`
   - Environments: Production, Preview, Development
   - Click **"Save"**

### Cursor Cloud Agents

1. Go to [Cursor Dashboard](https://cursor.sh/dashboard)
2. Navigate to **Cloud Agents** > **Secrets**
3. Add secrets:
   - Name: `EXPO_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSy...`
   - Scope: Repository
   - Click **"Save"**

---

## Part 5: Verify Everything Works

### Test Checklist

- [ ] Firebase connection successful
- [ ] Can fetch featured games from Firestore
- [ ] Payment provider initializes without errors
- [ ] Can create a free gift (no payment)
- [ ] Can create a paid gift (test payment)
- [ ] Payment processes successfully
- [ ] Gift link is generated
- [ ] Can share gift link
- [ ] Gift memories are saved

### Common Issues

#### "Firebase initialization failed"
- Check API key is correct
- Verify project ID matches
- Check Firestore is enabled
- Review security rules

#### "Payment service running in DEMO mode"
- No payment credentials configured
- Check .env file exists and is loaded
- Verify EXPO_PUBLIC_ prefix is used
- Restart development server

#### "Payment failed"
- In test mode: Use test cards only
- Check API keys are for same environment (test/production)
- Verify payment provider dashboard shows no errors
- Check network connectivity

---

## Part 6: Going to Production

### Pre-Launch Checklist

- [ ] Firebase security rules are production-ready
- [ ] Using production Firebase credentials
- [ ] Payment provider account verified (KYB complete)
- [ ] Using production payment credentials
- [ ] Test real payment with small amount
- [ ] Verify webhook endpoints (if using server)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure backup payment method
- [ ] Test in both iOS and Android
- [ ] Test web version

### Security Best Practices

1. **Never commit credentials**
   - Keep `.env` in `.gitignore`
   - Use secrets management for deployment

2. **Rotate keys periodically**
   - Change Firebase keys every 6 months
   - Regenerate payment keys after any breach

3. **Monitor transactions**
   - Set up alerts for failed payments
   - Review suspicious activity daily
   - Enable fraud detection in payment dashboard

4. **Backup strategy**
   - Export Firestore data weekly
   - Keep payment transaction logs
   - Document all credential changes

---

## Support

### Getting Help

- **Firebase:** [Firebase Support](https://firebase.google.com/support)
- **PayTabs:** [PayTabs Support](https://support.paytabs.com)
- **Stripe:** [Stripe Support](https://support.stripe.com)

### Documentation Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [PayTabs API Docs](https://dev.paytabs.com)
- [Stripe API Reference](https://stripe.com/docs/api)

---

**Ready to launch? Check the [Deployment Guide](./DEPLOYMENT.md) next.**
