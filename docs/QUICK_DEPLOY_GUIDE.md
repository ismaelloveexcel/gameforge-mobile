# Quick Deploy Guide 🚀

Get your GameForge Mobile app deployed in under 10 minutes!

## 🌐 Deploy Web Version (Fastest)

### Using Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the app**
   ```bash
   npm run build:web
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Done!** Your app is now live at `https://gameforge-mobile.vercel.app`

### Alternative: Using Netlify

```bash
npm install -g netlify-cli
npm run build:web
netlify deploy --prod --dir=web-build
```

---

## 📱 Deploy Mobile Version

### Android (Free)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure project** (first time only)
   ```bash
   eas build:configure
   ```

4. **Build APK**
   ```bash
   eas build --platform android --profile production
   ```

5. **Get download link** from the EAS dashboard or email notification

### iOS (Requires Apple Developer Account - $99/year)

```bash
eas build --platform ios --profile production
```

---

## 🔄 Continuous Deployment

### Set Up Auto-Deploy from GitHub

#### For Web (Vercel):

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import `ismaelloveexcel/gameforge-mobile` from GitHub
4. Configure:
   - Build command: `npm run build:web`
   - Output directory: `web-build`
5. Deploy!

Now every push to `main` automatically deploys!

#### For Mobile (EAS):

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm install -g eas-cli
      - run: eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 📊 Deployment Checklist

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Build web version: `npm run build:web`
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Configure EAS: `eas build:configure`
- [ ] Build Android APK: `eas build --platform android`
- [ ] Share app with testers
- [ ] Set up custom domain (optional)

---

## 🆘 Common Issues

### "Command not found: expo"
```bash
npm install -g expo-cli
```

### "Build failed: Out of memory"
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:web
```

### "EAS login failed"
```bash
# Create a new Expo account
eas register
```

---

## 📚 Need More Details?

See the complete [Free Deployment Recommendation](./FREE_DEPLOYMENT_RECOMMENDATION.md) guide for:
- Detailed platform comparisons
- Advanced configuration options
- Troubleshooting guide
- Cost breakdowns
- Alternative platforms

---

## 🎯 One-Line Deployments

```bash
# Web deployment
npm run build:web && vercel --prod

# Android development build
eas build --platform android --profile development

# Android production build
eas build --platform android --profile production
```

---

**Questions?** Check out:
- [Expo Documentation](https://docs.expo.dev/)
- [Vercel Documentation](https://vercel.com/docs)
- [Main Deployment Guide](./DEPLOYMENT.md)
