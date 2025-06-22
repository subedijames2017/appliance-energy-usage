const calculateEnergyUsageSimple = require('../../services/calculateEnergyUsageSimple');

// Part 1
describe('calculateEnergyUsageSimple', () => {
    it('should calculate correctly for a simple usage profile with initial state = "on"', () => {
      const usageProfile1 = {
        initial: 'on',
        events: [
          { timestamp: 126, state: 'off' },
          { timestamp: 833, state: 'on' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile1)).toEqual(
        126 + (1440 - 833)
      );
    });
  
    it('should calculate correctly for a simple usage profile with initial state = "off"', () => {
      const usageProfile2 = {
        initial: 'off',
        events: [
          { timestamp: 30, state: 'on' },
          { timestamp: 80, state: 'off' },
          { timestamp: 150, state: 'on' },
          { timestamp: 656, state: 'off' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile2)).toEqual(
        80 - 30 + (656 - 150)
      );
    });
  
    it('should calculate correctly when the appliance is on the whole time', () => {
      const usageProfile3 = {
        initial: 'on',
        events: [],
      };
      expect(calculateEnergyUsageSimple(usageProfile3)).toEqual(1440);
    });
  
    it('should handle duplicate on events', () => {
      const usageProfile = {
        initial: 'off',
        events: [
          { timestamp: 30, state: 'on' },
          { timestamp: 80, state: 'on' },
          { timestamp: 150, state: 'off' },
          { timestamp: 656, state: 'on' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(
        150 - 30 + (1440 - 656)
      );
    });
  
    it('should handle duplicate off events', () => {
      const usageProfile = {
        initial: 'on',
        events: [
          { timestamp: 30, state: 'on' },
          { timestamp: 80, state: 'off' },
          { timestamp: 150, state: 'off' },
          { timestamp: 656, state: 'on' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(
        80 - 0 + (1440 - 656)
      );
    });
  
    // New Test Case Below
    it('should skip events with null or undefined timestamps', () => {
      const usageProfile = {
        initial: 'on',
        events: [
          { timestamp: null, state: 'off' },
          { timestamp: 100, state: 'off' },
          { timestamp: undefined, state: 'on' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(100);
    });
  
    it('should ignore events with invalid state values', () => {
      const usageProfile = {
        initial: 'on',
        events: [
          { timestamp: 100, state: 'maybe' },
          { timestamp: 200, state: 'off' },
          { timestamp: 300 },                 // missing state
          { timestamp: 400, state: null },    // null state
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(200 - 0);
    });
  
    it('should skip events with out-of-range timestamps', () => {
      const usageProfile = {
        initial: 'on',
        events: [
          { timestamp: -50, state: 'off' },
          { timestamp: 50, state: 'off' },
          { timestamp: 2000, state: 'on' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(50);
    });
  
    it('should correctly handle unsorted events', () => {
      const usageProfile = {
        initial: 'on',
        events: [
          { timestamp: 300, state: 'off' },
          { timestamp: 100, state: 'off' },
          { timestamp: 200, state: 'on' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(
        100 - 0 + (300 - 200)
      );
    });
  
    it('should throw error on completely invalid profile', () => {
      const usageProfile = {
        initial: null,
        events: [
          { timestamp: 100 },
          { state: 'off' },
        ],
      };
  
      expect(() => calculateEnergyUsageSimple(usageProfile)).toThrow();
    });
  
    it('should ignore junk and calculate based on valid events only', () => {
      const usageProfile = {
        initial: 'off',
        events: [
          { timestamp: 'bad', state: 'on' },
          { timestamp: 50, state: 'on' },
          { timestamp: 100, state: 'off' },
          null,
          undefined,
          { timestamp: 150, state: 'on' },
          { timestamp: 300, state: 'off' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(
        100 - 50 + (300 - 150)
      );
    });
    
    it('should handle events at the start and end of the day correctly', () => {
      const usageProfile = {
        initial: 'off',
        events: [
          { timestamp: 0, state: 'on' },
          { timestamp: 1439, state: 'off' },
        ],
      };
      expect(calculateEnergyUsageSimple(usageProfile)).toEqual(1439);
    });
  
  
  });