import { formatTime, getPriorityColor, getCategoryIcon, getRandomBreakSuggestion } from '../helpers';

describe('Helper Functions', () => {
  describe('formatTime', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(30)).toBe('00:30');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(90)).toBe('01:30');
      expect(formatTime(3661)).toBe('61:01');
    });

    it('should handle negative numbers', () => {
      expect(formatTime(-1)).toBe('-00:01');
      expect(formatTime(-60)).toBe('-01:00');
    });

    it('should handle large numbers', () => {
      expect(formatTime(3599)).toBe('59:59');
      expect(formatTime(7200)).toBe('120:00');
    });
  });

  describe('getPriorityColor', () => {
    it('should return correct colors for light mode', () => {
      expect(getPriorityColor('low', false)).toBe('text-green-600');
      expect(getPriorityColor('medium', false)).toBe('text-yellow-600');
      expect(getPriorityColor('high', false)).toBe('text-orange-600');
      expect(getPriorityColor('urgent', false)).toBe('text-red-600');
    });

    it('should return correct colors for dark mode', () => {
      expect(getPriorityColor('low', true)).toBe('text-green-400');
      expect(getPriorityColor('medium', true)).toBe('text-yellow-400');
      expect(getPriorityColor('high', true)).toBe('text-orange-400');
      expect(getPriorityColor('urgent', true)).toBe('text-red-400');
    });

    it('should handle unknown priority levels', () => {
      expect(getPriorityColor('unknown', false)).toBeUndefined();
      expect(getPriorityColor('unknown', true)).toBeUndefined();
    });
  });

  describe('getCategoryIcon', () => {
    it('should return correct icons for known categories', () => {
      expect(getCategoryIcon('work')).toBe('💼');
      expect(getCategoryIcon('personal')).toBe('🏠');
      expect(getCategoryIcon('learning')).toBe('📚');
      expect(getCategoryIcon('creative')).toBe('🎨');
      expect(getCategoryIcon('health')).toBe('💪');
    });

    it('should return default icon for unknown categories', () => {
      expect(getCategoryIcon('unknown')).toBe('📝');
      expect(getCategoryIcon('')).toBe('📝');
    });
  });

  describe('getRandomBreakSuggestion', () => {
    it('should return a string', () => {
      const suggestion = getRandomBreakSuggestion();
      expect(typeof suggestion).toBe('string');
      expect(suggestion.length).toBeGreaterThan(0);
    });

    it('should return different suggestions on multiple calls', () => {
      const suggestions = new Set();
      // Call multiple times to increase chance of getting different suggestions
      for (let i = 0; i < 20; i++) {
        suggestions.add(getRandomBreakSuggestion());
      }
      expect(suggestions.size).toBeGreaterThan(1);
    });

    it('should return suggestions with emojis', () => {
      const suggestion = getRandomBreakSuggestion();
      // Most suggestions should contain emojis
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      expect(emojiRegex.test(suggestion)).toBe(true);
    });
  });
});