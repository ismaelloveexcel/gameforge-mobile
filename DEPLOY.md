# 🚀 One-Click Deployment Guide

**For non-technical users** - Deploy your GameForge Mobile app in just 1 step!

---

## 🎯 Deployment Flow

```
┌─────────────────────────────────────────────────────────┐
│  Run Script (./deploy.sh or deploy.bat)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  First Time?   │
            └────┬───────┬───┘
                 │ Yes   │ No
                 ▼       ▼
        ┌──────────┐  ┌──────────────┐
        │ Setup    │  │ Use Saved    │
        │ Wizard   │  │ Config       │
        └─────┬────┘  └──────┬───────┘
              │              │
              └──────┬───────┘
                     ▼
            ┌────────────────┐
            │  Install Deps  │
            └────────┬───────┘
                     ▼
            ┌────────────────┐
            │  Build & Deploy│
            └────────┬───────┘
                     ▼
            ┌────────────────┐
            │  ✅ Success!   │
            └────────────────┘
```

---

## ✨ Quick Start

### For Mac/Linux Users:

```bash
./deploy.sh
```

### For Windows Users:

```cmd
deploy.bat
```

That's it! The script will handle everything automatically. 🎉

---

## 📋 What Happens?

### First Time Setup (Automatic)
1. Script asks what you want to deploy (Web, Android, or Both)
2. Checks if required tools are installed
3. Installs any missing tools automatically
4. Saves your preferences

### Every Deployment After (One-Click)
- Just run the script again
- It remembers your choices
- Automatically builds and deploys
- Shows you the results

---

## 🎯 Deployment Options

When running for the first time, you'll be asked to choose:

### Option 1: Web Version (Fastest) ⚡
- **Time:** 2-5 minutes
- **Cost:** Free
- **Result:** Live web app on Vercel
- **Best for:** Quick testing and sharing

### Option 2: Android App 📱
- **Time:** 10-20 minutes
- **Cost:** Free
- **Result:** Downloadable APK file
- **Best for:** Mobile testing and distribution

### Option 3: Both Web + Android 🌐📱
- **Time:** 15-25 minutes
- **Cost:** Free
- **Result:** Both web and mobile apps
- **Best for:** Complete deployment

---

## 🔑 First-Time Requirements

### Check Your System First

Not sure if your system is ready? Run the diagnostic script:

```bash
./check-deployment.sh
```

This will check all requirements and tell you exactly what's missing!

### Before Running the Script

You need accounts on these free services (one-time setup):

1. **Vercel** (for web deployment)
   - Sign up: [vercel.com/signup](https://vercel.com/signup)
   - Use your GitHub account for easy login

2. **Expo** (for mobile deployment)
   - Sign up: [expo.dev/signup](https://expo.dev/signup)
   - Create a free account

### The Script Will Ask You To:

1. **Login to Vercel** (if deploying web)
   - Browser will open automatically
   - Click "Authorize" when prompted

2. **Login to Expo** (if deploying mobile)
   - Enter your Expo email and password when prompted

That's all! The script remembers your login after the first time.

---

## 📱 Accessing Your Deployed App

### Web Version
After deployment completes:
- Check your terminal for the live URL
- Or visit your [Vercel Dashboard](https://vercel.com/dashboard)
- Share the URL with anyone!

### Android App
After build completes:
- Check your email for download link
- Or visit [Expo Dashboard](https://expo.dev)
- Download the APK and install on Android devices

---

## 🔄 Changing Deployment Options

Want to deploy something different?

```bash
# Delete the config file
rm .deployment-config   # Mac/Linux
del .deployment-config  # Windows

# Run the script again to reconfigure
./deploy.sh             # Mac/Linux
deploy.bat              # Windows
```

---

## ❓ Troubleshooting

### Run System Diagnostics

Before troubleshooting manually, run our diagnostic script:

```bash
./check-deployment.sh
```

This will automatically check your system and tell you exactly what needs to be fixed!

### Common Issues

### "Node.js not found"
Install Node.js from [nodejs.org](https://nodejs.org/)

### "Permission denied" (Mac/Linux)
```bash
chmod +x deploy.sh
./deploy.sh
```

### "Vercel login failed"
1. Make sure you have a Vercel account
2. Check your internet connection
3. Try: `vercel login`

### "EAS build failed"
1. Make sure you have an Expo account
2. Try: `eas login`
3. Run the script again

### Still having issues?
Check the detailed guides in the `docs/` folder:
- [GitHub Actions Setup](docs/GITHUB_ACTIONS_SETUP.md)
- [Quick Deploy Guide](docs/QUICK_DEPLOY_GUIDE.md)

---

## 🎓 What's Happening Behind the Scenes?

For curious users, here's what the script does:

1. **Checks your system**
   - Verifies Node.js and npm are installed
   - Installs deployment tools if needed

2. **Builds your app**
   - Web: Creates optimized production build
   - Android: Packages app with Expo Application Services

3. **Deploys automatically**
   - Web: Uploads to Vercel's global CDN
   - Android: Builds APK in the cloud

4. **Provides status updates**
   - Shows progress with clear messages
   - Tells you where to find your deployed app

---

## 🌟 Advanced: Automated Deployment

Want even more automation? We also have GitHub Actions!

Every time you push code to GitHub, it automatically:
- ✅ Tests your code
- ✅ Builds web version
- ✅ Deploys to Vercel
- ✅ Creates mobile builds

**Setup:** See [GitHub Actions Deployment Guide](docs/GITHUB_ACTIONS_DEPLOYMENT.md)

---

## 💡 Tips for Non-Technical Users

### Do's ✅
- ✅ Run the script from the project folder
- ✅ Keep Node.js and npm updated
- ✅ Use the same deployment option consistently
- ✅ Wait for completion before closing terminal

### Don'ts ❌
- ❌ Don't close terminal while deploying
- ❌ Don't edit configuration files manually
- ❌ Don't run multiple deployments simultaneously
- ❌ Don't delete `node_modules` manually

---

## 📞 Need Help?

### Quick Help
1. Read error messages carefully
2. Check the troubleshooting section above
3. Look in the `docs/` folder for detailed guides

### Community Support
- Open an issue on GitHub
- Check existing documentation
- Ask in project discussions

---

## 🎉 You're Ready!

```bash
# Mac/Linux
./deploy.sh

# Windows
deploy.bat
```

**That's literally all you need to do!** 🚀

---

**Made with ❤️ for non-technical users**

*One command. Zero complexity. Professional deployment.*
