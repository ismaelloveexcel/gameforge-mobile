# 🚀 QUICK START: Alchemist's Forge Features

## ⚡ 5-Minute Setup

### Step 1: Enable Full Wow Features (Optional)
```typescript
// src/config/flags.ts
export const PlayGiftConsumerMode = true; // Change false → true
```

### Step 2: Test the Wizard
```bash
npm start
# Navigate to: GiftForgeWizard screen
```

### Step 3: Try Different Occasions
1. Select **"Valentine's Day"** → See pink valentine theme + Alchemist
2. Select **"Ramadan"** → See gold ramadan theme + Alchemist
3. Select **"Birthday"** → See default theme + Alchemist
4. Press any button → Feel the squish! 🎯

---

## 📝 Quick Examples

### Example 1: Use Glassmorphism in Any Component
```typescript
import { glassCard } from '../styles/glassmorphism';

function MyComponent() {
  return (
    <View style={glassCard('valentine')}>
      <Text>This card has premium glass effect!</Text>
    </View>
  );
}
```

### Example 2: Add Tactile Button Anywhere
```typescript
import { TactileButton } from '../components/TactileButton';

function MyScreen() {
  return (
    <TactileButton onPress={handlePress}>
      <Text>Press me and feel the squish!</Text>
    </TactileButton>
  );
}
```

### Example 3: Add Alchemist to Any Screen
```typescript
import { AlchemistCompanion } from '../components/AlchemistCompanion';

function MyScreen() {
  return (
    <AlchemistCompanion
      occasion="valentine"
      mood="brewing"
      size="large"
    />
  );
}
```

---

## 🎯 What You Get Out of the Box

### ✅ Always On (No Config Needed)
- Tactile button squish animations (60fps)
- Premium glassmorphism effects
- Alchemist floating animations
- Smooth enter animations

### 🔓 When You Enable PlayGiftConsumerMode
- Particle systems (hearts, lanterns)
- Shimmer gradient effects
- Potion glow animations
- Background morphing transitions

---

## 🧪 Quick Test Checklist

```bash
# 1. Start the app
npm start

# 2. Navigate to Gift Wizard
# 3. Test basic features (flag = false)
[ ] Press a button → Squish animation works
[ ] View cards → Glass effect looks premium
[ ] Select occasion → Alchemist appears
[ ] Check all platforms → Web, iOS, Android work

# 4. Enable full features (flag = true)
[ ] Edit src/config/flags.ts → Set to true
[ ] Reload app
[ ] Verify particle effects appear
[ ] Verify potion glow on Alchemist
[ ] Verify smooth background morphing

# 5. Test seasonal themes
[ ] Select "Valentine's Day" → Pink theme
[ ] Select "Ramadan" → Gold theme
[ ] Verify Alchemist messages change
```

---

## 📁 Where Everything Lives

```
src/
├── config/flags.ts           ← Toggle feature flag here
├── styles/glassmorphism.ts   ← Glass effect utilities
├── components/
│   ├── TactileButton.tsx     ← Squish button
│   └── AlchemistCompanion.tsx← Alchemist character
├── services/ArtStyleService.ts ← Seasonal styles
└── screens/
    └── GiftForgeWizardScreen.tsx ← See it in action
```

---

## 🎨 Available Themes

```typescript
// Import the glass utility
import { glassCard } from '../styles/glassmorphism';

// Use any theme:
glassCard('light')      // Clean white glass
glassCard('dark')       // Deep dark glass
glassCard('valentine')  // Pink rose glass 💝
glassCard('ramadan')    // Gold lantern glass 🌙
```

---

## 🔧 Common Customizations

### Change Button Squish Amount
```typescript
<TactileButton squishScale={0.90}> {/* More squish */}
  <Text>Press Me</Text>
</TactileButton>
```

### Change Alchemist Size
```typescript
<AlchemistCompanion size="small" />  // Compact
<AlchemistCompanion size="medium" /> // Default
<AlchemistCompanion size="large" />  // Big
```

### Custom Alchemist Message
```typescript
<AlchemistCompanion
  occasion="valentine"
  message="Your custom message here!"
/>
```

---

## 🐛 Troubleshooting

### Animations Not Smooth?
- Check that react-native-reanimated is properly configured
- Verify `PlayGiftConsumerMode` is set correctly
- Test on device (not just simulator)

### Glass Effect Not Showing?
- Web: Check browser supports backdrop-filter (Chrome 76+)
- Mobile: Shadows should work everywhere
- Verify styles are being applied

### Alchemist Not Appearing?
- Check that occasion is selected in wizard
- Verify component is imported correctly
- Check console for errors

---

## 💡 Pro Tips

1. **Start with flag = false** → Get basic polish, test performance
2. **Then enable flag = true** → Add wow features gradually
3. **Test on real devices** → Simulators don't show true performance
4. **Use glassmorphism sparingly** → Premium cards and panels only
5. **Let Alchemist guide** → Show after occasion selection

---

## 📚 Learn More

- **Full Docs:** See `ALCHEMIST_FEATURES.md`
- **Visual Guide:** See `VISUAL_GUIDE.md`
- **Implementation:** See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 You're Ready!

That's it! You now have:
- ✅ Feature flag system
- ✅ Premium glassmorphism
- ✅ Tactile animations
- ✅ Alchemist character
- ✅ Seasonal themes

**Start creating amazing gift experiences!** 🚀

---

**Questions?** Check the docs or review the inline code comments.
