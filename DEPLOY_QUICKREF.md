# 📋 Quick Deployment Reference Card

> **Print this page** and keep it handy for quick deployment!

---

## 🚀 Deploy Your App (3 Steps)

### Step 1: Open Terminal/Command Prompt
- **Mac:** Press `⌘ + Space`, type "Terminal"
- **Windows:** Press `Win + R`, type "cmd"

### Step 2: Navigate to Project
```bash
cd /path/to/gameforge-mobile
```

### Step 3: Run Deploy Script
```bash
# Mac/Linux
./deploy.sh

# Windows
deploy.bat
```

**✅ Done! The script does the rest.**

---

## 🔑 First-Time Setup (One-Time Only)

When you run the script for the first time:

1. **Choose deployment type:**
   - Type `1` for Web only (fastest)
   - Type `2` for Android only  
   - Type `3` for both

2. **Login when prompted:**
   - Vercel: Browser opens → Click "Authorize"
   - Expo: Enter email and password in terminal

**That's it!** The script remembers your choices.

---

## 📱 Where to Find Your Deployed App

### Web Version
- Check terminal output for URL
- Or visit: [vercel.com/dashboard](https://vercel.com/dashboard)
- Usually: `https://gameforge-mobile.vercel.app`

### Android App
- Check your email for download link
- Or visit: [expo.dev](https://expo.dev)
- Click on your latest build

---

## ⏱️ How Long Does It Take?

| Deployment Type | Time |
|----------------|------|
| Web only | 2-5 minutes |
| Android only | 10-20 minutes |
| Both | 15-25 minutes |

---

## 🔄 Need to Change Settings?

```bash
# Delete config file
rm .deployment-config    # Mac/Linux
del .deployment-config   # Windows

# Run script again to reconfigure
./deploy.sh             # Mac/Linux
deploy.bat              # Windows
```

---

## ❓ Common Issues & Quick Fixes

### "Command not found: node"
**Fix:** Install Node.js from [nodejs.org](https://nodejs.org/)

### "Permission denied" (Mac/Linux)
```bash
chmod +x deploy.sh
./deploy.sh
```

### "Vercel login failed"
**Fix:** Create account at [vercel.com/signup](https://vercel.com/signup)

### "EAS build failed"
**Fix:** Create account at [expo.dev/signup](https://expo.dev/signup)

---

## 💡 Pro Tips

✅ **Always run from project folder**
✅ **Don't close terminal during deployment**
✅ **First deployment takes longer (setup)**
✅ **Keep Node.js updated**

❌ **Don't run multiple deployments at once**
❌ **Don't edit .deployment-config manually**

---

## 📞 Need More Help?

- 📖 Full Guide: `DEPLOY.md` in project folder
- 📚 Documentation: `docs/` folder
- 🐛 Issues: GitHub Issues page
- 💬 Support: Project discussions

---

## 🎯 The Bottom Line

**One command deploys your entire app:**

```bash
./deploy.sh    # Mac/Linux
deploy.bat     # Windows
```

**No coding. No confusion. Just deployment.** 🚀

---

**GameForge Mobile** | *Made for non-technical users* | v1.0
