const { sanitizeAndSortDailyEvents } = require('../../utils');

describe('sanitizeAndSortDailyEvents', () => {
  it('should remove invalid timestamps and states', () => {
    const events = [
      { timestamp: null, state: 'on' },
      { timestamp: 100, state: 'maybe' },
      { timestamp: 200, state: 'off' },
    ];
    const result = sanitizeAndSortDailyEvents(events);
    expect(result).toEqual([{ timestamp: 200, state: 'off' }]);
  });

  it('should sort valid events chronologically', () => {
    const events = [
      { timestamp: 300, state: 'on' },
      { timestamp: 100, state: 'off' },
    ];
    const result = sanitizeAndSortDailyEvents(events);
    expect(result).toEqual([
      { timestamp: 100, state: 'off' },
      { timestamp: 300, state: 'on' },
    ]);
  });
});
