const { sanitizeAndSortDailyEvents, MAX_IN_PERIOD, VALID_STATES } = require('../utils');

/**
 * Calculates the total energy usage (in minutes) for an appliance over a single day (0–1439 minutes).
 *
 * The function uses an initial state (`on` or `off`) and an array of timestamped events
 * that switch the appliance between states. It calculates how long the appliance remains
 * in the 'on' state throughout the day.
 *
 * @param {Object} profile - The usage profile for the day.
 * @param {string} profile.initial - Initial state of the appliance ('on' or 'off').
 * @param {Array<Object>} profile.events - Array of state change events with structure: { timestamp: number, state: string }.
 *
 * @returns {number} Total minutes the appliance was ON during the day.
 * @throws {Error} If the profile is invalid or events are malformed.
 */
function calculateEnergyUsageSimple(profile) {
  try {
    // Step 1: Validate input structure
    if (
      !profile ||
      !VALID_STATES.includes(profile.initial) ||
      !Array.isArray(profile.events)
    ) {
        throw new Error('Profile input is invalid. Please ensure it includes a valid initial state ("on" or "off") and an array of state change events.');
    }

    // Step 2: Sanitize and sort events to ensure proper order and remove invalid entries
    const sortedEvents = sanitizeAndSortDailyEvents(profile.events);

    // Step 3: Initialize state tracking
    let total = 0;                     // Accumulator for ON time
    let state = profile.initial;       // Current state (starts with initial)
    let lastChangeTime = 0;            // Timestamp of the last valid state change

    // Step 4: Process each event in chronological order
    for (const event of sortedEvents) {
      const { timestamp, state: newState } = event;

      // Ignore redundant events (duplicate state or out-of-order timestamps)
      if (timestamp < lastChangeTime || newState === state) continue;

      // If appliance was ON, accumulate the time it stayed on
      if (state === 'on') {
        total += timestamp - lastChangeTime;
      }

      // Update state and last change time
      state = newState;
      lastChangeTime = timestamp;
    }

    // Step 5: If appliance was still ON at the end of the day, add remaining time
    if (state === 'on') {
      total += MAX_IN_PERIOD - lastChangeTime;
    }

    return total;
  } catch (err) {
    throw new Error(`Failed to calculate energy usage: ${err.message}`);
  }
}

module.exports = calculateEnergyUsageSimple;
