import { genieService } from '../services/GenieService';

describe('GenieService - PlayGift Creative Brief', () => {
  describe('generateCreativeBrief', () => {
    it('should generate a creative brief for PlayGift', async () => {
      const brandName = 'PlayGift';
      const theme = 'Nocturnal Romance';
      const colors = {
        primary: '#4A1E5A',
        accent: '#D4AF37',
        dark: '#0A1931',
        secondary: '#B76E79',
      };

      const brief = await genieService.generateCreativeBrief(brandName, theme, colors);

      expect(brief).toBeDefined();
      expect(brief.brandName).toBe(brandName);
      expect(brief.theme).toBe(theme);
      expect(brief.colors).toEqual(colors);
      expect(brief.brief).toBeDefined();
      expect(brief.concepts).toBeDefined();
      expect(Array.isArray(brief.concepts)).toBe(true);
      expect(brief.requiredAssets).toBeDefined();
      expect(Array.isArray(brief.requiredAssets)).toBe(true);
      expect(brief.timestamp).toBeDefined();
    });

    it('should generate at least 3 creative concepts', async () => {
      const brief = await genieService.generateCreativeBrief(
        'PlayGift',
        'Nocturnal Romance',
        {
          primary: '#4A1E5A',
          accent: '#D4AF37',
          dark: '#0A1931',
          secondary: '#B76E79',
        }
      );

      expect(brief.concepts.length).toBeGreaterThanOrEqual(3);
      
      // Check each concept has required properties
      brief.concepts.forEach((concept: any) => {
        expect(concept).toHaveProperty('name');
        expect(concept).toHaveProperty('coreSymbol');
        expect(concept).toHaveProperty('typography');
        expect(concept).toHaveProperty('visualAdjective');
      });
    });

    it('should include required asset list', async () => {
      const brief = await genieService.generateCreativeBrief(
        'PlayGift',
        'Nocturnal Romance',
        {
          primary: '#4A1E5A',
          accent: '#D4AF37',
          dark: '#0A1931',
          secondary: '#B76E79',
        }
      );

      expect(brief.requiredAssets.length).toBeGreaterThan(0);
      
      // Should include common asset types
      const assetString = brief.requiredAssets.join(' ').toLowerCase();
      expect(
        assetString.includes('icon') ||
        assetString.includes('favicon') ||
        assetString.includes('logo')
      ).toBe(true);
    });

    it('should work with creative personality', async () => {
      const response = await genieService.processMessage(
        'Generate a logo concept for PlayGift',
        'creative'
      );

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);
    });
  });

  describe('Default Creative Concepts', () => {
    it('should include Elegant Fusion concept', async () => {
      const brief = await genieService.generateCreativeBrief(
        'TestBrand',
        'Test Theme',
        { primary: '#000', accent: '#fff', dark: '#111', secondary: '#888' }
      );

      const conceptNames = brief.concepts.map((c: any) => c.name);
      expect(
        conceptNames.some((name: string) => 
          name.includes('Elegant') || name.includes('Fusion') || name.includes('Digital') || name.includes('Jewel')
        )
      ).toBe(true);
    });
  });
});
