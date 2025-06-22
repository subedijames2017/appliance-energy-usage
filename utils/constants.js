/**
 * Total number of minutes in a single day
 */
const MAX_IN_PERIOD = 1440;

/**
 * Valid states allowed in events
 */
const VALID_STATES = ['on', 'off'];

/**
 * Valid states allowed in Energry Saver events
 */
const VALID_STATES_ENERGY_SAVE = ['on', 'off', 'auto-off'];

module.exports = {
  MAX_IN_PERIOD,
  VALID_STATES,
  VALID_STATES_ENERGY_SAVE
};


