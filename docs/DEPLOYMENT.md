# Deployment Guide

Learn how to build and publish your GameForge games to iOS, Android, and Web platforms.

## Pre-Deployment Checklist

- [ ] Game is fully tested on target devices
- [ ] All assets are optimized
- [ ] Performance profiled and optimized
- [ ] Analytics integrated
- [ ] Privacy policy created
- [ ] App store assets prepared (icons, screenshots, descriptions)
- [ ] Monetization configured
- [ ] Crash reporting setup

## Building for iOS

### Prerequisites
- Mac with macOS 12+
- Xcode 14+
- Apple Developer Account ($99/year)
- iOS device for testing

### Steps

1. **Configure App Identifier**
```bash
# Update app.json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.yourgame"
  }
}
```

2. **Build**
```bash
expo build:ios
```

3. **Submit to App Store**
- Use Application Loader or Transporter
- Fill in App Store Connect details
- Submit for review

### iOS Optimization Tips
- Enable bitcode
- Use App Thinning
- Test on older devices (iPhone 8+)
- Optimize for different screen sizes

## Building for Android

### Prerequisites
- Android Studio
- Google Play Developer Account ($25 one-time)
- Android device for testing

### Steps

1. **Configure Package Name**
```bash
# Update app.json
{
  "android": {
    "package": "com.yourcompany.yourgame"
  }
}
```

2. **Build APK/AAB**
```bash
# APK for testing
expo build:android -t apk

# AAB for Play Store
expo build:android -t app-bundle
```

3. **Upload to Play Console**
- Create app listing
- Upload AAB file
- Complete store listing
- Submit for review

### Android Optimization
- Enable ProGuard
- Use Android App Bundle
- Test on various devices
- Support multiple screen densities

## Building for Web

### Steps

1. **Build Web Version**
```bash
expo build:web
```

2. **Deploy**

**Option A: Static Hosting (Netlify, Vercel)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=web-build
```

**Option B: GitHub Pages**
```bash
npm run deploy:github
```

**Option C: Custom Server**
```bash
# Upload web-build folder to your server
```

**Option D: Replit**

Replit is a cloud-based development environment that allows you to run, build, and deploy your GameForge app directly from your browser.

1. **Import the Repository**
   - Go to [replit.com](https://replit.com)
   - Click "Create Repl" → "Import from GitHub"
   - Paste the repository URL: `https://github.com/ismaelloveexcel/gameforge-mobile`
   - The `.replit` and `replit.nix` configuration files will automatically set up the environment

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the App**
   - Click the "Run" button or use the command:
   ```bash
   npm run web
   ```

4. **Deploy to Production**
   - Click the "Deploy" button in the Replit interface
   - Replit will automatically build and deploy your app
   - Your app will be available at `https://your-repl-name.your-username.repl.co`

5. **Custom Domain (Optional)**
   - Go to your Repl settings → "Domain"
   - Add your custom domain
   - Update DNS settings as instructed

**Replit Environment Features:**
- Node.js 20 LTS pre-configured
- TypeScript language server for IDE support
- Automatic HTTPS
- Built-in environment variable management
- Integrated deployment pipeline

**Option E: GitHub Spark**

GitHub Spark is a GitHub-native platform for building and deploying micro web applications directly from your repository.

1. **Prerequisites**
   - A GitHub account with Spark access enabled
   - The repository must include a `spark.yaml` configuration file (already included in this project)

2. **Deploy from GitHub**
   - Navigate to your repository on GitHub
   - Click on the "Spark" tab or access via GitHub's Spark interface
   - Select the repository `ismaelloveexcel/gameforge-mobile`
   - GitHub Spark will automatically detect the `spark.yaml` configuration

3. **Build and Deploy**
   - Spark will run the build command: `npm install && npm run build:web`
   - The `web-build` directory will be served as a static site
   - Your app will be available at a GitHub Spark URL

4. **Configuration**
   The `spark.yaml` file in the repository root defines:
   ```yaml
   name: gameforge-mobile
   build:
     command: npm install && npm run build:web
     output_directory: web-build
   runtime:
     type: static
     node_version: "20"
   ```

5. **Environment Variables**
   - Configure environment variables through the Spark dashboard
   - Or define them in the `spark.yaml` under `environment.variables`

**GitHub Spark Features:**
- Native GitHub integration
- Automatic deployments on push
- Built-in HTTPS
- Environment variable management
- Zero configuration required with `spark.yaml`

### Web Optimization
- Enable PWA features
- Configure caching
- Optimize bundle size
- Enable gzip compression

## App Store Listings

### Required Assets

**Icons:**
- iOS: 1024x1024px
- Android: 512x512px
- Web: 192x192px, 512x512px

**Screenshots:**
- iOS: Various device sizes
- Android: Phone and tablet
- Web: Desktop and mobile

**Videos:**
- 15-30 seconds gameplay
- Highlight key features
- No tutorial text

### Writing Descriptions

**Title:** Keep it under 30 characters
```
Example: "Puzzle Quest: Match Adventure"
```

**Subtitle/Short Description:**
```
"Match gems, solve puzzles, save the kingdom!"
```

**Full Description:**
- Hook in first 2 sentences
- List key features
- Mention awards/achievements
- Call to action

### Keywords (ASO)

Research and use:
- Genre-specific terms
- Gameplay mechanics
- Popular search terms
- Competitor analysis

## Monetization Setup

### In-App Purchases

**iOS (StoreKit):**
```typescript
import * as InAppPurchases from 'expo-in-app-purchases';

await InAppPurchases.connectAsync();
const { responseCode, results } = await InAppPurchases.getProductsAsync([
  'com.yourgame.coins100',
  'com.yourgame.removeads'
]);
```

**Android (Google Play Billing):**
```typescript
// Similar setup with expo-in-app-purchases
```

### Ads Integration

```typescript
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';

// Banner ad
<AdMobBanner
  adUnitID="ca-app-pub-xxxxx/xxxxx"
  servePersonalizedAds={false}
/>

// Interstitial ad
await AdMobInterstitial.setAdUnitID('ca-app-pub-xxxxx/xxxxx');
await AdMobInterstitial.requestAdAsync();
await AdMobInterstitial.showAdAsync();
```

## Analytics

### Firebase Analytics
```typescript
import * as Analytics from 'expo-firebase-analytics';

// Log events
await Analytics.logEvent('level_complete', {
  level: 5,
  score: 1000
});
```

### Custom Events
```typescript
// Track important metrics
trackEvent('game_start');
trackEvent('purchase', { item: 'coins', amount: 100 });
trackEvent('ad_watched');
```

## Testing

### Beta Testing

**iOS (TestFlight):**
1. Upload build to App Store Connect
2. Add beta testers
3. Send invitations
4. Collect feedback

**Android (Internal Testing):**
1. Upload to Play Console
2. Create testing track
3. Add testers by email
4. Release for testing

### Performance Testing
- Device variety (low to high end)
- Network conditions (2G to 5G)
- Battery usage
- Memory leaks
- Crash testing

## Post-Launch

### Monitoring
- Crash reports (Sentry, Firebase Crashlytics)
- User reviews and ratings
- Analytics dashboards
- Server performance (if applicable)

### Updates
- Regular bug fixes
- New content/features
- Seasonal events
- Performance improvements

### Marketing
- Social media promotion
- Email campaigns
- App store optimization
- Influencer outreach

## Common Issues

### Build Failures
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Signing Issues
- Verify certificates
- Check provisioning profiles
- Ensure bundle IDs match

### Rejection Reasons
- Incomplete metadata
- Crashes on launch
- Privacy policy missing
- Inappropriate content

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [ASO Tools](https://www.appannie.com/)

---

**Need help with deployment?** Ask Genie's Marketing Guru personality for guidance!
