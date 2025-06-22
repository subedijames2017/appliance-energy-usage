const { sanitizeAndSortMultipleDaysEvents, MAX_IN_PERIOD, VALID_STATES } = require('../utils');
const calculateEnergyUsageSimple = require('./calculateEnergyUsageSimple');

/**
 * Calculates the total energy usage (in minutes) for a specific day (1–365)
 * from a yearly appliance usage profile.
 *
 * The function filters the state change events relevant to the given day,
 * determines the initial state at the start of that day, and delegates the
 * actual usage computation to `calculateEnergyUsageSimple`.
 *
 * @param {Object} profile - The full month-long usage profile.
 * @param {string} profile.initial - Initial state of the appliance ('on' or 'off').
 * @param {Array<Object>} profile.events - Array of events: each with a `timestamp` and `state`.
 * @param {number} day - The day number (1 to 365) for which to calculate usage.
 *
 * @returns {number} Total minutes the appliance was ON during the specified day.
 * @throws {Error} If day is invalid or profile is malformed.
 */
function calculateEnergyUsageForDay(profile, day) {
  try {
    // Step 1: Validate input
    if (!Number.isInteger(day)) {
      throw new Error('day must be an integer');
    }
    if (day < 1 || day > 365) {
      throw new Error('day out of range');
    }

    if (
      !profile ||
      !VALID_STATES.includes(profile.initial) ||
      !Array.isArray(profile.events)
    ) {
        throw new Error('Profile input is invalid. Please ensure it includes a valid initial state ("on" or "off") and an array of state change events.');
    }

    // Step 2: Compute timestamp range for the specified day
    const dayStart = (day - 1) * MAX_IN_PERIOD;
    const dayEnd = dayStart + MAX_IN_PERIOD;

    // Step 3: Clean and sort the yearly events
    const sortedEvents = sanitizeAndSortMultipleDaysEvents(profile.events);

    // Step 4: Extract only the events within the day and normalize timestamps
    const filteredEvents = sortedEvents
      .filter(event => event.timestamp >= dayStart && event.timestamp < dayEnd)
      .map(event => ({
        ...event,
        timestamp: event.timestamp - dayStart, // Normalize to 0–1439 range
      }));

    // Step 5: Determine the initial state at the start of the day
    let initialState = profile.initial;
    for (let i = sortedEvents.length - 1; i >= 0; i--) {
      const event = sortedEvents[i];
      if (event.timestamp < dayStart) {
        initialState = event.state;
        break;
      }
    }

    // Step 6: Delegate to `calculateEnergyUsageSimple` with day-specific data
    return calculateEnergyUsageSimple({
      initial: initialState,
      events: filteredEvents,
    });
  } catch (err) {
    throw new Error(`Failed to calculate energy usage for day ${day}: ${err.message}`);
  }
}

module.exports = calculateEnergyUsageForDay;
