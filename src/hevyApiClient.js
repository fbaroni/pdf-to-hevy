/**
 * Hevy API Client Module
 * 
 * Handles communication with the Hevy API.
 * 
 * @module hevyApiClient
 */

/**
 * Prepare Hevy API payload from mapped workout
 * @param {Object} workout - Mapped workout data
 * @returns {Object} Hevy API compatible payload
 */
function prepareHevyPayload(workout) {
  if (!workout || !workout.exercises) {
    throw new Error('Invalid workout data');
  }

  return {
    title: workout.routine_name || 'Imported Workout',
    exercises: workout.exercises.map((exercise, index) => ({
      index: index,
      exercise_template_id: exercise.hevy_exercise_id,
      title: exercise.hevy_exercise_title,
      notes: exercise.notes || '',
      sets: exercise.sets.map(set => ({
        type: 'normal',
        weight_kg: set.weight_kg,
        reps: set.reps,
        distance_meters: null,
        duration_seconds: null,
        rpe: null
      }))
    }))
  };
}

/**
 * Validate Hevy API response
 * @param {Object} response - API response
 * @returns {boolean} True if valid
 */
function validateResponse(response) {
  return response && (response.id || response.routine_id);
}

/**
 * Build Hevy API request headers
 * @param {string} apiKey - Hevy API key
 * @returns {Object} Headers object
 */
function buildHeaders(apiKey) {
  if (!apiKey) {
    throw new Error('Hevy API key is required');
  }

  return {
    'api-key': apiKey,
    'Content-Type': 'application/json'
  };
}

module.exports = {
  prepareHevyPayload,
  validateResponse,
  buildHeaders
};
