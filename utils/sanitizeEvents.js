const { MAX_IN_PERIOD, VALID_STATES, VALID_STATES_ENERGY_SAVE } = require('./constants.js');

/**
 * Filters and sorts events restricted to a single day (timestamps in range 0–1439).
 *
 * @param {Array} events - The raw array of profile events
 * @returns {Array} - Cleaned and sorted array of valid daily events
 */
function sanitizeAndSortDailyEventsEnergySave(events) {
  return [...events]
    .filter(
      (event) =>
        event &&
        typeof event.timestamp === 'number' &&
        Number.isFinite(event.timestamp) &&
        event.timestamp >= 0 &&
        event.timestamp < MAX_IN_PERIOD &&
        VALID_STATES_ENERGY_SAVE.includes(event.state)
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Filters and sorts events restricted to a single day (timestamps in range 0–1439).
 *
 * @param {Array} events - The raw array of profile events
 * @returns {Array} - Cleaned and sorted array of valid daily events
 */
function sanitizeAndSortDailyEvents(events) {
  return [...events]
    .filter(
      (event) =>
        event &&
        typeof event.timestamp === 'number' &&
        Number.isFinite(event.timestamp) &&
        event.timestamp >= 0 &&
        event.timestamp < MAX_IN_PERIOD &&
        VALID_STATES.includes(event.state)
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Filters and sorts events across the full year (timestamps >= 0).
 *
 * @param {Array} events - The raw array of profile events
 * @returns {Array} - Cleaned and sorted array of valid yearly events
 */
function sanitizeAndSortMultipleDaysEvents(events) {
  return [...events]
    .filter(
      (event) =>
        event &&
        typeof event.timestamp === 'number' &&
        Number.isFinite(event.timestamp) &&
        event.timestamp >= 0 &&
        VALID_STATES.includes(event.state)
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

module.exports = {
  sanitizeAndSortDailyEvents,
  sanitizeAndSortDailyEventsEnergySave,
  sanitizeAndSortMultipleDaysEvents,
};
