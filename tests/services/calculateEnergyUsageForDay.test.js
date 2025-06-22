const calculateEnergyUsageForDay = require('../../services/calculateEnergyUsageForDay');
const { MAX_IN_PERIOD } = require('../../utils/constants');

// Part 3
describe('calculateEnergyUsageForDay', () => {
    const monthProfile = {
      initial: 'on',
      events: [
        { state: 'off', timestamp: 500 },
        { state: 'on', timestamp: 900 },
        { state: 'off', timestamp: 1400 },
        { state: 'on', timestamp: 1700 },
        { state: 'off', timestamp: 1900 },
        { state: 'on', timestamp: 2599 },
        { state: 'off', timestamp: 2900 },
        { state: 'on', timestamp: 3000 },
        { state: 'off', timestamp: 3500 },
        { state: 'on', timestamp: 4000 },
        { state: 'off', timestamp: 4420 },
        { state: 'on', timestamp: 4500 },
      ],
    };
  
    it('should calculate the energy usage for an empty set of events correctly', () => {
      expect(
        calculateEnergyUsageForDay({ initial: 'off', events: [] }, 10)
      ).toEqual(0);
      expect(
        calculateEnergyUsageForDay({ initial: 'on', events: [] }, 5)
      ).toEqual(1440);
    });
  
    it('should calculate day 1 correctly', () => {
      expect(calculateEnergyUsageForDay(monthProfile, 1)).toEqual(
        500 - 0 + (1400 - 900)
      );
    });
  
    it('should calculate day 2 correctly', () => {
      expect(calculateEnergyUsageForDay(monthProfile, 2)).toEqual(
        1900 - 1700 + (2880 - 2599)
      );
    });
  
    it('should calculate day 3 correctly', () => {
      expect(calculateEnergyUsageForDay(monthProfile, 3)).toEqual(
        2900 - 2880 + (3500 - 3000) + (4320 - 4000)
      );
    });
  
    it('should calculate day 4 correctly', () => {
      expect(calculateEnergyUsageForDay(monthProfile, 4)).toEqual(
        4420 - 4320 + (5760 - 4500)
      );
    });
  
    it('should calculate day 5 correctly', () => {
      expect(calculateEnergyUsageForDay(monthProfile, 5)).toEqual(MAX_IN_PERIOD);
    });
  
    it('should calculate day 2 correctly when the first event starts on day 4', () => {
      const monthProfile1 = {
        initial: 'off',
        events: [{ timestamp: 4500, state: 'on' }],
      };
      expect(calculateEnergyUsageForDay(monthProfile1, 2)).toEqual(0);
      expect(calculateEnergyUsageForDay(monthProfile1, 4)).toEqual(1260);
      expect(calculateEnergyUsageForDay(monthProfile1, 15)).toEqual(
        MAX_IN_PERIOD
      );
    });
  
    it('should throw an error on an out of range day number', () => {
      // The regular expression matches the message of the Error(), which is
      // the first parameter to the Error class constructor.
      expect(() => calculateEnergyUsageForDay(monthProfile, -5)).toThrow(
        /day out of range/
      );
      expect(() => calculateEnergyUsageForDay(monthProfile, 0)).toThrow(
        /day out of range/
      );
      expect(() => calculateEnergyUsageForDay(monthProfile, 366)).toThrow(
        /day out of range/
      );
    });
  
    it('should throw an error on a non-integer day number', () => {
      expect(() => calculateEnergyUsageForDay(3.76)).toThrow(
        /must be an integer/
      );
    });
  });