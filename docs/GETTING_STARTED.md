# Getting Started with GameForge Mobile

Welcome to GameForge Mobile! This guide will help you create your first game in minutes.

## Table of Contents
- [Installation](#installation)
- [Your First Project](#your-first-project)
- [Understanding the Interface](#understanding-the-interface)
- [Next Steps](#next-steps)

## Installation

### System Requirements
- Node.js 16 or higher
- npm or yarn package manager
- 4GB RAM minimum (8GB recommended)
- 2GB free disk space

### Platform-Specific Requirements

#### iOS Development (Mac only)
- macOS 12 or higher
- Xcode 14+
- CocoaPods

#### Android Development
- Android Studio
- Android SDK (API 29+)
- Java Development Kit (JDK) 11+

### Step 1: Install Expo CLI

```bash
npm install -g expo-cli
```

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/ismaelloveexcel/gameforge-mobile.git

# Navigate to project directory
cd gameforge-mobile

# Install dependencies
npm install
```

### Step 3: Start Development Server

```bash
npm start
```

This will open the Expo Developer Tools in your browser.

## Your First Project

### 1. Choose a Template

When you first launch GameForge, you'll see 15 game templates to choose from:

**Beginner-Friendly:**
- Puzzle Match-3
- Endless Runner
- Quiz/Trivia
- Idle Clicker
- Interactive Story

**Intermediate:**
- Tower Defense
- Platformer
- Card Game
- Rhythm Game
- Shooting Gallery

**Advanced:**
- Racing Game
- VR Escape Room
- AR Treasure Hunt

💡 **Tip:** Start with a beginner template like "Endless Runner" to learn the basics.

### 2. Select an Art Style

Choose one of our 5 signature art styles:

1. **Pixel Perfect** - Retro 8-bit/16-bit aesthetic
2. **Low Poly 3D** - Modern minimalist look
3. **Hand-Drawn** - Artistic cartoon style
4. **Neon Cyberpunk** - Futuristic neon aesthetic
5. **Watercolor Dreams** - Soft, painted style

### 3. Meet Genie - Your AI Assistant

Genie has 4 personalities to help you:

- **Creative Mentor** - For game design questions
- **Technical Expert** - For implementation help
- **Marketing Guru** - For promotion strategies
- **Educator** - For learning and teaching

Try asking Genie:
- "How do I make my game more challenging?"
- "What's the best way to add power-ups?"
- "Help me optimize performance"

### 4. Customize Your Game

#### Adding Objects

```typescript
// Create a new game object
const player = {
  id: 'player',
  name: 'Player Character',
  type: 'sprite',
  position: { x: 100, y: 100 },
  properties: {
    texture: 'assets/player.png',
    speed: 5
  }
};

engine.createGameObject(player);
```

#### Modifying Properties

```typescript
// Update object position
engine.updateGameObject('player', {
  position: { x: 200, y: 150 }
});
```

### 5. Test Your Game

Press the play button to test your game in real-time. Changes you make will be reflected immediately.

## Understanding the Interface

### Main Navigation

- **Home** - Dashboard and quick actions
- **Projects** - Your saved games
- **Templates** - Browse template library
- **Genie** - AI assistant chat

### Project Editor

The editor has several panels:

1. **Scene Hierarchy** - List of objects in your scene
2. **Properties Panel** - Edit selected object properties
3. **Asset Library** - Browse and add assets
4. **Preview Window** - See your game in action

### Toolbar Actions

- **Play/Pause** - Test your game
- **Save** - Save your project
- **Undo/Redo** - Revert changes
- **Export** - Build for deployment

## Quick Tips

### Performance Optimization

1. **Use Object Pooling** for frequently spawned objects
2. **Limit Particle Effects** on mobile devices
3. **Optimize Asset Sizes** - compress images
4. **Profile Regularly** - use built-in profiler

### Best Practices

1. **Start Simple** - Add complexity gradually
2. **Test Often** - Play your game frequently
3. **Get Feedback** - Share with friends
4. **Iterate** - Improve based on feedback

### Common Mistakes to Avoid

❌ **Don't:**
- Add too many features at once
- Ignore performance warnings
- Skip playtesting
- Forget to save regularly

✅ **Do:**
- Focus on core gameplay first
- Optimize as you build
- Test on target devices
- Use version control

## Next Steps

Now that you've created your first game, explore these topics:

1. [Template Documentation](TEMPLATES.md) - Deep dive into each template
2. [Genie AI Guide](GENIE_AI.md) - Master the AI assistant
3. [Art Styles Guide](ART_STYLES.md) - Customize visual appearance
4. [Marketing Guide](MARKETING.md) - Promote your game
5. [Deployment Guide](DEPLOYMENT.md) - Publish to app stores

## Need Help?

- 💬 **Ask Genie** - Your AI assistant is always available
- 📖 **Check Docs** - Comprehensive documentation
- 🐛 **Report Issues** - GitHub Issues
- 💬 **Join Discord** - Community support

## Video Tutorials

🎥 Watch our video series:
- [GameForge Basics (10 min)](https://example.com/basics)
- [Creating Your First Game (20 min)](https://example.com/first-game)
- [Advanced Techniques (30 min)](https://example.com/advanced)

---

**Ready to create?** Open GameForge and start building your dream game!
