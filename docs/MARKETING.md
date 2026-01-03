# Marketing Automation Guide

Promote your game with built-in marketing tools.

## Features

- Campaign creation
- Social media content generation
- Analytics dashboard
- User segmentation
- Email campaigns
- Push notifications

## Creating Campaigns

```typescript
import { marketingService } from '@/services/MarketingService';

// Create campaign
const campaign = marketingService.createCampaign(
  projectId,
  'social' // or 'email', 'push', 'inapp'
);

// Generate content
const content = await marketingService.generatePromotionalContent(
  'My Puzzle Game',
  'puzzle',
  ['match-3', 'daily challenges', 'leaderboards']
);

// Schedule
marketingService.scheduleCampaign(
  campaign.id,
  new Date('2024-01-15'),
  new Date('2024-02-15')
);
```

## Analytics

```typescript
// Get dashboard
const analytics = marketingService.getAnalyticsDashboard(projectId);

// Access metrics
console.log(analytics.overview.users);
console.log(analytics.overview.revenue);
console.log(analytics.overview.retention);
```

## Social Media

Generate platform-specific posts:

```typescript
const twitterPost = await marketingService.generateSocialPost(
  'twitter',
  content
);

const instagramPost = await marketingService.generateSocialPost(
  'instagram',
  content
);
```

## User Segmentation

```typescript
const segments = marketingService.getUserSegments(projectId);
// Returns: Power Users, Casual Players, New Users, At Risk
```

## Best Practices

1. **Pre-Launch:** Build anticipation
2. **Launch:** Coordinate across platforms
3. **Post-Launch:** Maintain engagement
4. **Always:** Track metrics and optimize

---

Ask Genie's Marketing Guru for personalized advice!
