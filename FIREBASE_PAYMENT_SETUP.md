# Firebase & Payment Quick Setup

> Fast-track configuration for the GameForge Unified Ecosystem

---

## 🚀 Quick Start (5 Minutes)

### 1. Firebase Setup

```bash
# 1. Create Firebase project at console.firebase.google.com
# 2. Enable Firestore Database
# 3. Copy your config to .env:

cp .env.example .env
# Then edit .env with your Firebase credentials
```

### 2. Payment Setup (Choose One)

#### Option A: PayTabs (UAE - Recommended)
```bash
# 1. Sign up at site.paytabs.com
# 2. Use test credentials while waiting for verification
# 3. Add to .env:

EXPO_PUBLIC_PAYTABS_PROFILE_ID=your_profile_id
EXPO_PUBLIC_PAYTABS_CLIENT_KEY=your_client_key
```

#### Option B: Stripe (International)
```bash
# 1. Sign up at stripe.com
# 2. Get test publishable key
# 3. Add to .env:

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### 3. Test It

```bash
npm install
npm start
```

✅ Check console for: "Firebase initialized" and "PayTabs/Stripe initialized"

---

## 📚 Full Documentation

For detailed step-by-step instructions, see:
- **[Configuration Guide](./docs/CONFIGURATION_GUIDE.md)** - Complete setup walkthrough
- **[Unified Ecosystem](./UNIFIED_ECOSYSTEM.md)** - System architecture overview
- **[.env.example](./.env.example)** - All available configuration options

---

## 🔑 Required Environment Variables

### Firebase (Required)
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

### Payment (Choose One)
```bash
# PayTabs (UAE)
EXPO_PUBLIC_PAYTABS_PROFILE_ID=
EXPO_PUBLIC_PAYTABS_CLIENT_KEY=

# OR Stripe (International)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## ⚠️ Important Notes

### Demo Mode
- If no payment credentials configured, app runs in **DEMO mode**
- All gifts are free in demo mode
- Perfect for testing the user experience

### Test Cards
**PayTabs Sandbox:**
- Card: 4111 1111 1111 1111
- CVV: 123
- Expiry: Any future date

**Stripe Test:**
- Card: 4242 4242 4242 4242
- CVV: Any 3 digits
- Expiry: Any future date

### Production
Before going live:
1. ✅ Complete PayTabs KYB verification
2. ✅ Switch to production API keys
3. ✅ Update Firebase security rules
4. ✅ Test with real payment (small amount)
5. ✅ Add keys as deployment secrets

---

## 🆘 Troubleshooting

### "Firebase initialization failed"
- Verify all 6 Firebase env vars are set
- Check Firestore is enabled in Firebase console
- Restart development server

### "Payment service running in DEMO mode"
- Payment credentials not configured (this is OK for testing)
- To enable real payments, add PayTabs or Stripe keys

### "Payment failed"
- Using production cards in test mode (use test cards)
- API keys from different environments (test vs production)
- Payment provider dashboard shows errors

---

## 📞 Support

- Firebase: [console.firebase.google.com/support](https://console.firebase.google.com/support)
- PayTabs: [support.paytabs.com](https://support.paytabs.com)
- Stripe: [support.stripe.com](https://support.stripe.com)

---

**Configuration complete? Return to [README](./README.md) for next steps.**
