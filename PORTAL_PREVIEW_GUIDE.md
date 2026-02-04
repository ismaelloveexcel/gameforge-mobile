# Portal Preview Guide - Easy Ways to View Your App

**Created:** February 4, 2026  
**Purpose:** Quick reference for viewing the GameForge Mobile app without complex builds

---

## 🚀 Fastest Method: Expo Go (Recommended)

**Time to Preview:** ~2 minutes  
**Requirements:** Smartphone with Expo Go app installed

### Quick Steps:

1. **Install Expo Go** on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server:**
   ```bash
   npm start
   # OR for remote access (works outside your network):
   npm start -- --tunnel
   ```

3. **Scan the QR code** that appears:
   - iOS: Use Camera app
   - Android: Use Expo Go app directly

4. **App loads instantly** with live reload!

**✅ Pros:**
- No build required
- Instant changes (hot reload)
- Works on real devices
- Free to use

**⚠️ Limitations:**
- Only includes standard Expo modules (no custom native code)

---

## 🌐 Alternative 1: Web Preview

**Time to Preview:** ~5 minutes  
**Requirements:** Web browser only

### Quick Steps:

```bash
# Start web version
npm run web
# Opens at http://localhost:19006
```

**✅ Pros:**
- Fastest for quick checks
- No phone needed
- Desktop browser tools available

**⚠️ Limitations:**
- Mobile-specific features may not work
- Different from native app experience

---

## 📱 Alternative 2: PR #21 Solution (Already Created!)

**Time to Preview:** ~10 minutes (one-time setup)  
**Requirements:** GitHub account

Your repository already has **PR #21** which implements:
- **`npm run review`** command for instant tunnel deployment
- **Automated GitHub Actions** workflow for QR code generation
- **Quick-start scripts** for all platforms

### To Use This Solution:

1. **Merge PR #21** into your main branch
2. **Set up Expo token** (one-time):
   ```bash
   # Get your token from https://expo.dev/accounts/[username]/settings/access-tokens
   gh secret set EXPO_TOKEN --repo ismaelloveexcel/gameforge-mobile
   ```
3. **Future commits automatically generate QR codes** at expo.dev

**Link to PR:** https://github.com/ismaelloveexcel/gameforge-mobile/pull/21

---

## 🔧 Alternative 3: Vercel Web Deployment (Production-Like)

**Time to Preview:** ~15 minutes  
**Requirements:** Vercel account (free)

### Quick Steps:

1. **Sign up at [vercel.com](https://vercel.com)** (free)
2. **Get your tokens:**
   - Go to Settings → Tokens
   - Create new token
3. **Add secrets to GitHub:**
   ```bash
   gh secret set VERCEL_TOKEN --repo ismaelloveexcel/gameforge-mobile
   gh secret set VERCEL_ORG_ID --repo ismaelloveexcel/gameforge-mobile
   gh secret set VERCEL_PROJECT_ID --repo ismaelloveexcel/gameforge-mobile
   ```
4. **Push to main branch** - auto-deploys to web!

**✅ Pros:**
- Production-like environment
- Shareable URL
- Fast global CDN
- Automatic deployments

**⚠️ Limitations:**
- Web only (not native mobile)
- Requires account setup

---

## 🎯 Recommended Approach

### For Quick Local Review (You Haven't Seen It Yet):
1. **Use Expo Go** (Method 1) - Fastest and easiest!
   ```bash
   npm start -- --tunnel
   # Scan QR code with Expo Go app
   ```

### For Sharing with Others:
1. **Merge PR #21** - Enables automatic QR code generation
2. **Set EXPO_TOKEN** secret
3. **Share expo.dev link** with team

### For Production Web Preview:
1. **Configure Vercel** (Method 3)
2. **Auto-deploys on every push** to main

---

## 📊 Comparison Table

| Method | Time | Setup | Best For |
|--------|------|-------|----------|
| **Expo Go** | 2 min | None | Quick local testing |
| **Web Preview** | 5 min | None | Desktop testing |
| **PR #21 Solution** | 10 min | One-time | Team sharing + automation |
| **Vercel Deploy** | 15 min | One-time | Production preview |

---

## 🛠️ Troubleshooting

### Expo Go Can't Connect:
```bash
# Use tunnel mode (slower but works everywhere)
npm start -- --tunnel
```

### Web Build Fails:
```bash
# Clear cache and rebuild
rm -rf .expo web-build node_modules
npm install
npm run build:web
```

### QR Code Not Working:
- Make sure phone and computer are on same Wi-Fi
- OR use `--tunnel` mode
- Check firewall settings

---

## 🎓 Additional Resources

- **Expo Go Documentation:** https://docs.expo.dev/get-started/expo-go/
- **PR #21 Details:** See the PR for scripts and automation setup
- **README.md:** Full project setup instructions

---

## ✨ Quick Commands Reference

```bash
# Fastest preview (local network)
npm start

# Remote preview (works from anywhere)
npm start -- --tunnel

# Web browser preview
npm run web

# After merging PR #21
npm run review
```

---

**Bottom Line:** Use **Expo Go with `npm start --tunnel`** for the fastest way to see your app right now! 📱✨
