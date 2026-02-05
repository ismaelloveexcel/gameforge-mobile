/**
 * WildCardService Tests
 */
import wildCardService from '../services/WildCardService';

describe('WildCardService', () => {
  describe('generateWildCard', () => {
    it('generates a wildcard event', () => {
      const wildCard = wildCardService.generateWildCard('game', 'medium');
      
      expect(wildCard).toBeTruthy();
      expect(wildCard.id).toBeTruthy();
      expect(wildCard.type).toBeTruthy();
      expect(wildCard.title).toBeTruthy();
      expect(wildCard.effect).toBeTruthy();
    });

    it('generates events for different contexts', () => {
      const gameEvent = wildCardService.generateWildCard('game', 'easy');
      const giftEvent = wildCardService.generateWildCard('gift', 'hard');
      
      expect(gameEvent).toBeTruthy();
      expect(giftEvent).toBeTruthy();
    });
  });

  describe('getMysterySurprise', () => {
    it('returns a mystery surprise', () => {
      const surprise = wildCardService.getMysterySurprise();
      
      expect(surprise.revealed).toBe(true);
      expect(surprise.surprise).toBeTruthy();
      expect(surprise.emoji).toBeTruthy();
    });
  });

  describe('generatePowerUp', () => {
    it('generates a power-up', () => {
      const powerUp = wildCardService.generatePowerUp();
      
      expect(powerUp.name).toBeTruthy();
      expect(powerUp.description).toBeTruthy();
      expect(powerUp.duration).toBeGreaterThan(0);
      expect(powerUp.icon).toBeTruthy();
      expect(powerUp.effect).toBeTruthy();
    });
  });

  describe('generateChallenge', () => {
    it('generates a challenge', () => {
      const challenge = wildCardService.generateChallenge();
      
      expect(challenge.title).toBeTruthy();
      expect(challenge.description).toBeTruthy();
      expect(challenge.difficulty).toBeTruthy();
      expect(challenge.reward).toBeTruthy();
    });
  });

  describe('generatePlotTwist', () => {
    it('generates a plot twist', () => {
      const twist = wildCardService.generatePlotTwist('adventure story');
      
      expect(twist).toBeTruthy();
      expect(typeof twist).toBe('string');
      expect(twist.length).toBeGreaterThan(0);
    });
  });

  describe('shuffle', () => {
    it('shuffles an array', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = wildCardService.shuffle(original);
      
      expect(shuffled.length).toBe(original.length);
      expect(shuffled).toContain(1);
      expect(shuffled).toContain(5);
    });

    it('does not modify original array', () => {
      const original = [1, 2, 3];
      const shuffled = wildCardService.shuffle(original);
      
      expect(original).toEqual([1, 2, 3]);
    });
  });

  describe('randomPick', () => {
    it('picks random items from array', () => {
      const array = [1, 2, 3, 4, 5];
      const picked = wildCardService.randomPick(array, 2);
      
      expect(picked.length).toBe(2);
      picked.forEach(item => {
        expect(array).toContain(item);
      });
    });

    it('returns all items if count exceeds array length', () => {
      const array = [1, 2, 3];
      const picked = wildCardService.randomPick(array, 10);
      
      expect(picked.length).toBe(3);
    });
  });

  describe('randomInRange', () => {
    it('generates random number in range', () => {
      const min = 1;
      const max = 10;
      const random = wildCardService.randomInRange(min, max);
      
      expect(random).toBeGreaterThanOrEqual(min);
      expect(random).toBeLessThanOrEqual(max);
    });
  });

  describe('rollDice', () => {
    it('rolls dice', () => {
      const rolls = wildCardService.rollDice(6, 2);
      
      expect(rolls.length).toBe(2);
      rolls.forEach(roll => {
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
      });
    });
  });

  describe('coinFlip', () => {
    it('flips a coin', () => {
      const result = wildCardService.coinFlip();
      expect(['heads', 'tails']).toContain(result);
    });
  });

  describe('generateEasterEgg', () => {
    it('generates an easter egg', () => {
      const easterEgg = wildCardService.generateEasterEgg();
      
      expect(easterEgg.type).toBeTruthy();
      expect(easterEgg.content).toBeTruthy();
      expect(easterEgg.hint).toBeTruthy();
    });
  });

  describe('getEventHistory', () => {
    it('returns event history', () => {
      wildCardService.clearHistory();
      wildCardService.generateWildCard('game', 'medium');
      
      const history = wildCardService.getEventHistory();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe('clearHistory', () => {
    it('clears event history', () => {
      wildCardService.generateWildCard('game', 'medium');
      wildCardService.clearHistory();
      
      const history = wildCardService.getEventHistory();
      expect(history.length).toBe(0);
    });
  });

  describe('weightedRandom', () => {
    it('selects item based on weights', () => {
      const items = ['a', 'b', 'c'];
      const weights = [10, 1, 1]; // 'a' should be selected more often
      
      const selected = wildCardService.weightedRandom(items, weights);
      expect(items).toContain(selected);
    });
  });
});
