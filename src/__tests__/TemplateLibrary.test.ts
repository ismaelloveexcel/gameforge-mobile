import { templateLibrary } from '../services/TemplateLibrary';

describe('TemplateLibrary', () => {
  describe('getAllTemplates', () => {
    it('should return all 15 templates', () => {
      const templates = templateLibrary.getAllTemplates();
      expect(templates).toHaveLength(15);
    });

    it('should return templates with required properties', () => {
      const templates = templateLibrary.getAllTemplates();
      templates.forEach(template => {
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('category');
        expect(template).toHaveProperty('difficulty');
        expect(template).toHaveProperty('features');
        expect(template).toHaveProperty('engine');
        expect(template).toHaveProperty('data');
      });
    });
  });

  describe('getTemplateById', () => {
    it('should return correct template by ID', () => {
      const template = templateLibrary.getTemplateById('match3');
      expect(template).toBeDefined();
      expect(template?.name).toBe('Puzzle Match-3');
    });

    it('should return undefined for invalid ID', () => {
      const template = templateLibrary.getTemplateById('invalid-id');
      expect(template).toBeUndefined();
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should return templates for valid category', () => {
      const puzzles = templateLibrary.getTemplatesByCategory('puzzle');
      expect(puzzles.length).toBeGreaterThan(0);
      puzzles.forEach(template => {
        expect(template.category).toBe('puzzle');
      });
    });

    it('should return empty array for non-existent category', () => {
      const templates = templateLibrary.getTemplatesByCategory('non-existent');
      expect(templates).toHaveLength(0);
    });
  });

  describe('getTemplatesByEngine', () => {
    it('should return Pixi.js templates', () => {
      const pixiTemplates = templateLibrary.getTemplatesByEngine('pixi');
      expect(pixiTemplates.length).toBeGreaterThan(0);
      pixiTemplates.forEach(template => {
        expect(template.engine).toBe('pixi');
      });
    });

    it('should return Babylon.js templates', () => {
      const babylonTemplates = templateLibrary.getTemplatesByEngine('babylon');
      expect(babylonTemplates.length).toBeGreaterThan(0);
      babylonTemplates.forEach(template => {
        expect(template.engine).toBe('babylon');
      });
    });

    it('should return A-Frame templates', () => {
      const aframeTemplates = templateLibrary.getTemplatesByEngine('aframe');
      expect(aframeTemplates.length).toBeGreaterThan(0);
      aframeTemplates.forEach(template => {
        expect(template.engine).toBe('aframe');
      });
    });
  });

  describe('getTemplatesByDifficulty', () => {
    it('should return beginner templates', () => {
      const beginnerTemplates = templateLibrary.getTemplatesByDifficulty('beginner');
      expect(beginnerTemplates.length).toBeGreaterThan(0);
      beginnerTemplates.forEach(template => {
        expect(template.difficulty).toBe('beginner');
      });
    });

    it('should return intermediate templates', () => {
      const intermediateTemplates = templateLibrary.getTemplatesByDifficulty('intermediate');
      expect(intermediateTemplates.length).toBeGreaterThan(0);
      intermediateTemplates.forEach(template => {
        expect(template.difficulty).toBe('intermediate');
      });
    });

    it('should return advanced templates', () => {
      const advancedTemplates = templateLibrary.getTemplatesByDifficulty('advanced');
      expect(advancedTemplates.length).toBeGreaterThan(0);
      advancedTemplates.forEach(template => {
        expect(template.difficulty).toBe('advanced');
      });
    });
  });

  describe('Template Data Integrity', () => {
    it('should have valid template data structure', () => {
      const templates = templateLibrary.getAllTemplates();
      templates.forEach(template => {
        expect(template.data).toHaveProperty('scenes');
        expect(template.data).toHaveProperty('assets');
        expect(template.data).toHaveProperty('scripts');
        expect(template.data).toHaveProperty('settings');
        expect(Array.isArray(template.data.scenes)).toBe(true);
        expect(Array.isArray(template.data.assets)).toBe(true);
        expect(Array.isArray(template.data.scripts)).toBe(true);
      });
    });

    it('should have valid features array', () => {
      const templates = templateLibrary.getAllTemplates();
      templates.forEach(template => {
        expect(Array.isArray(template.features)).toBe(true);
        expect(template.features.length).toBeGreaterThan(0);
      });
    });
  });
});
