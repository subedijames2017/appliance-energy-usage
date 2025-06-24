const { sanitizeAndSortDailyEventsEnergySave, MAX_IN_PERIOD, VALID_STATES_ENERGY_SAVE } = require('../utils');

/**
 * Calculates the total duration (in seconds) that energy was saved due to
 * the system being in 'auto-off' mode during a fixed period.
 *
 * @param {Object} profile - The profile object containing initial state and events.
 * @param {('on'|'off'|'auto-off')} profile.initial - The initial state of the system.
 * @param {Array<{ timestamp: number, state: 'on' | 'off' | 'auto-off' }>} profile.events - 
 *        Array of state change events with timestamps.
 * @returns {number} The total duration in seconds that the system was in 'auto-off' state.
 * @throws {Error} If the input is invalid or the calculation fails.
 */
function calculateEnergySavings(profile) {
  try {
    // Validate the profile input
    if (
      !profile ||
      !VALID_STATES_ENERGY_SAVE.includes(profile.initial) ||
      !Array.isArray(profile.events)
    ) {
      throw new Error(
        'Profile input is invalid. Please ensure it includes a valid initial state ("on" or "off", "auto-off") and an array of state change events.'
      );
    }

    // Sanitize and sort the input events by timestamp
    const sortedEvents = sanitizeAndSortDailyEventsEnergySave(profile.events);

    // Initialize tracking variables
    let totalSaved = 0;              // Accumulates total time in auto-off
    let state = profile.initial;     // Current system state
    let autoOffStart = null;         // When auto-off starts (null if not active)

    // Loop through all sorted events
    for (const event of sortedEvents) {
      const { timestamp, state: newState } = event;

      // If system was in auto-off and now turned 'on', add saved duration
      if (autoOffStart !== null && newState === 'on') {
        totalSaved += timestamp - autoOffStart;
        autoOffStart = null;
      }

      // If new state is auto-off and system was not already in auto-off
      if (newState === 'auto-off' && state === 'on') {
        autoOffStart = timestamp;
      }

      // If new state is 'off' after 'auto-off', ignore it
      if (newState === 'off' && state === 'auto-off') {
        continue;
      }

      // If auto-off follows off, ignore the auto-off
      if (newState === 'auto-off' && state !== 'on') {
        continue;
      }

      // Update current state and timestamp
      state = newState;
      lastChangeTime = timestamp;
    }

    // If system is still in auto-off at end of period, add remaining time
    if (autoOffStart !== null) {
      totalSaved += MAX_IN_PERIOD - autoOffStart;
    }

    // Special case: if no events and system started in auto-off
    if (!autoOffStart && state === 'auto-off' && sortedEvents.length === 0) {
      totalSaved = MAX_IN_PERIOD;
    }

    return totalSaved;
  } catch (err) {
    throw new Error(`Failed to calculate energy savings: ${err.message}`);
  }
}

module.exports = calculateEnergySavings;
