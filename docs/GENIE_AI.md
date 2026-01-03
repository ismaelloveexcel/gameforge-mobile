# Genie AI Assistant Guide

Meet Genie - your intelligent AI companion for game development. Genie comes with 4 specialized personalities, each designed to help you with different aspects of game creation.

## The Four Personalities

### 1. Creative Mentor 🎨

**Best for:** Game design, storytelling, and creative decisions

**Expertise:**
- Game mechanics brainstorming
- Narrative development
- Character design
- Level design concepts
- Player motivation strategies
- Genre-specific ideas

**Example Questions:**
```
"How can I make my puzzle game more engaging?"
"What's a good story hook for an adventure game?"
"Help me design unique power-ups"
"How do I balance difficulty progression?"
```

**Sample Response:**
> "Great question! For puzzle games, engagement comes from the 'aha!' moment. Consider implementing these mechanics:
> 1. Start with obvious solutions to build confidence
> 2. Introduce one new mechanic every 5 levels
> 3. Create 'eureka' moments with optional challenges
> Try combining two existing mechanics in unexpected ways!"

### 2. Technical Expert ⚙️

**Best for:** Implementation, optimization, and debugging

**Expertise:**
- Code implementation
- Performance optimization
- Bug fixing
- Architecture patterns
- API integration
- Platform-specific issues

**Example Questions:**
```
"How do I implement object pooling?"
"My game is running slow, how can I optimize it?"
"What's the best way to handle collisions?"
"Help me debug this physics issue"
```

**Sample Code Generation:**
```typescript
// Ask: "Generate a sprite pooling system"
class SpritePool {
  private pool: Sprite[] = [];
  private active: Set<Sprite> = new Set();
  
  get(): Sprite {
    let sprite = this.pool.pop();
    if (!sprite) {
      sprite = new Sprite();
    }
    this.active.add(sprite);
    return sprite;
  }
  
  release(sprite: Sprite): void {
    this.active.delete(sprite);
    sprite.reset();
    this.pool.push(sprite);
  }
}
```

### 3. Marketing Guru 📈

**Best for:** Promotion, monetization, and user acquisition

**Expertise:**
- Marketing strategy
- Social media campaigns
- Monetization models
- User analytics
- ASO (App Store Optimization)
- Community building

**Example Questions:**
```
"How should I price my game?"
"What's the best monetization strategy?"
"How do I market my game on social media?"
"Help me create a launch campaign"
```

**Marketing Insights:**
> "For your puzzle game, consider a freemium model:
> - Free: First 20 levels + ads
> - Premium: $2.99 removes ads + exclusive levels
> - IAP: Level packs $0.99 each
> 
> Launch strategy:
> Week 1: Soft launch in 2 countries
> Week 2-3: Gather feedback, iterate
> Week 4: Global launch with influencer campaign"

### 4. Educator 📚

**Best for:** Learning, teaching, and educational content

**Expertise:**
- Teaching game development
- Educational game design
- Learning progressions
- Pedagogical approaches
- Tutorial creation
- Accessibility features

**Example Questions:**
```
"How do I teach players my game mechanics?"
"What makes a good tutorial?"
"How can I make my educational game fun?"
"Explain game loops to me"
```

**Educational Approach:**
> "Great tutorials follow the 'Show, Tell, Do' pattern:
> 1. SHOW: Demonstrate the mechanic
> 2. TELL: Explain what happened
> 3. DO: Let player try with guidance
> 
> For your match-3 game:
> - Level 1: Auto-match demonstration
> - Level 2: Guided matching
> - Level 3: Independent play with hints"

## Using Genie Effectively

### Switching Personalities

Tap the personality chips at the top to switch between personalities. Choose based on your current need:

- 🎨 Creative challenge? → **Creative Mentor**
- ⚙️ Technical problem? → **Technical Expert**
- 📈 Marketing question? → **Marketing Guru**
- 📚 Learning something new? → **Educator**

### Best Practices

#### 1. Be Specific

❌ Bad: "Help me with my game"
✅ Good: "How can I make my endless runner more challenging after level 10?"

#### 2. Provide Context

Include relevant information:
- Game type/genre
- Current implementation
- What you've tried
- Specific problems

Example:
```
"I'm making a tower defense game with Pixi.js. 
Enemies are reaching the end too quickly. 
I've tried reducing their speed but it makes the game boring.
What else can I do?"
```

#### 3. Ask Follow-up Questions

Genie remembers your conversation context:
```
You: "How do I add power-ups to my game?"
Genie: [Explains power-up system]
You: "How would that work with my match-3 mechanics?"
Genie: [Provides match-3 specific implementation]
```

#### 4. Request Code Examples

```
"Show me code for a score multiplier system"
"Generate a TypeScript class for enemy AI"
"Write a function to detect matches in a grid"
```

### Feature Highlights

#### Contextual Suggestions

Genie provides actionable suggestions after each response:

```
Suggestions:
• "Implement combo system"
• "Add visual feedback"
• "Create difficulty curve"
```

Tap a suggestion to automatically populate your next question.

#### Code Snippets

When Genie provides code, you can:
- Copy to clipboard
- Apply directly to your project (coming soon)
- Request explanations

#### Smart Recommendations

Genie analyzes your project and suggests:
- Assets you might need
- Features to add
- Optimizations to consider
- Best practices for your genre

## Advanced Usage

### Multi-Personality Workflow

Combine personalities for complex tasks:

1. **Creative Mentor** - Design the feature
   ```
   "How should collectibles work in my runner game?"
   ```

2. **Technical Expert** - Implement it
   ```
   "Show me code for the collectible system we discussed"
   ```

3. **Marketing Guru** - Monetize it
   ```
   "How can I monetize these collectibles?"
   ```

4. **Educator** - Teach players
   ```
   "Design a tutorial for the collectible feature"
   ```

### Project Context

Genie understands your project:
- Current template
- Art style
- Engine type
- Recent actions

This means responses are tailored to your specific setup.

### Integration with Other Features

#### Asset Recommendations

Ask: "What assets do I need for a space shooter?"

Genie suggests:
- Spaceship sprites
- Laser effects
- Background starfield
- UI elements
- Sound effects

#### Template Customization

Ask: "How do I modify the endless runner template to be underwater?"

Genie guides you through:
- Changing physics (buoyancy)
- Replacing assets (fish, coral)
- Adjusting mechanics (swimming)
- Adding effects (bubbles)

## Common Workflows

### Debugging

```
1. Describe the problem
   "My sprites are flickering"

2. Genie asks clarifying questions
   "Which engine? When does it happen?"

3. Provide details
   "Pixi.js, when sprites overlap"

4. Get solution
   [Genie explains z-index and sorting]
```

### Feature Development

```
1. Creative Mentor: Design
   "I want a power-up system"

2. Get design framework
   [Types, effects, duration, etc.]

3. Technical Expert: Code
   "Implement this power-up system"

4. Get implementation
   [Complete code with explanations]
```

### Optimization

```
1. Report performance issue
   "Game lags on mobile devices"

2. Technical Expert analyzes
   [Profiling suggestions]

3. Implement fixes
   [Optimization techniques]

4. Verify improvement
   [Testing guidance]
```

## Tips & Tricks

### 🎯 Power User Tips

1. **Use Shortcuts**: Save common questions
2. **Chain Questions**: Build on previous answers
3. **Request Comparisons**: "Compare approach A vs B"
4. **Ask for Alternatives**: "What other options exist?"

### 💡 Getting Better Answers

- Include error messages verbatim
- Describe expected vs actual behavior
- Mention device/platform specifics
- Share relevant code snippets

### 🚀 Productivity Hacks

1. **Morning Planning**: Ask Creative Mentor for daily goals
2. **Debugging Sessions**: Technical Expert for problem-solving
3. **Marketing Fridays**: Marketing Guru for promotion planning
4. **Learning Lunches**: Educator for skill development

## FAQ

**Q: Can Genie write complete games for me?**
A: Genie guides and assists, but you're the game designer. Think of Genie as your expert consultant.

**Q: Does Genie remember past conversations?**
A: Within a session, yes. Across sessions, Genie starts fresh but remembers your project details.

**Q: Can I use Genie offline?**
A: Currently, Genie requires an internet connection for AI processing.

**Q: How accurate is Genie's code?**
A: Genie provides production-quality code, but always test and review for your specific needs.

**Q: Can I customize Genie's personality?**
A: The four personalities are designed for specific tasks, but you can provide feedback to refine responses.

## Examples by Game Type

### Puzzle Games
- "Design progression for my match-3"
- "Balance difficulty curve"
- "Create special gem types"

### Action Games
- "Implement enemy AI patterns"
- "Design boss battles"
- "Balance weapon stats"

### VR Games
- "Handle motion sickness"
- "Design VR interactions"
- "Optimize for Quest 2"

---

**Pro Tip:** The more you use Genie, the better it understands your style and preferences. Don't hesitate to ask questions - Genie is here to help!
