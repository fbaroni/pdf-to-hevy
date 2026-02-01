/**
 * Exercise Mapper Module
 * 
 * Maps exercise names to Hevy exercise IDs.
 * 
 * @module exerciseMapper
 */

// Exercise mapping database
// In production, this would be fetched from Hevy API
const EXERCISE_MAP = {
  'bench press': { id: 'bench_press', title: 'Bench Press (Barbell)' },
  'squats': { id: 'squats', title: 'Squat (Barbell)' },
  'squat': { id: 'squats', title: 'Squat (Barbell)' },
  'deadlifts': { id: 'deadlift', title: 'Deadlift (Barbell)' },
  'deadlift': { id: 'deadlift', title: 'Deadlift (Barbell)' },
  'shoulder press': { id: 'shoulder_press', title: 'Shoulder Press (Barbell)' },
  'overhead press': { id: 'shoulder_press', title: 'Shoulder Press (Barbell)' },
  'bicep curls': { id: 'bicep_curl', title: 'Bicep Curl (Barbell)' },
  'bicep curl': { id: 'bicep_curl', title: 'Bicep Curl (Barbell)' },
  'tricep extension': { id: 'tricep_extension', title: 'Tricep Extension' },
  'lat pulldown': { id: 'lat_pulldown', title: 'Lat Pulldown' },
  'rows': { id: 'barbell_row', title: 'Barbell Row' },
  'barbell row': { id: 'barbell_row', title: 'Barbell Row' },
  'pull ups': { id: 'pull_up', title: 'Pull Up' },
  'pull up': { id: 'pull_up', title: 'Pull Up' },
  'push ups': { id: 'push_up', title: 'Push Up' },
  'push up': { id: 'push_up', title: 'Push Up' },
  'dumbbell press': { id: 'dumbbell_press', title: 'Dumbbell Press' },
  'leg press': { id: 'leg_press', title: 'Leg Press' },
  'lunges': { id: 'lunges', title: 'Lunges' },
  'plank': { id: 'plank', title: 'Plank' }
};

/**
 * Map exercise name to Hevy exercise data
 * @param {string} exerciseName - Name of the exercise
 * @returns {Object} Mapping result with id, title, and confidence
 */
function mapExercise(exerciseName) {
  const normalizedName = exerciseName.toLowerCase().trim();
  
  // Exact match
  if (EXERCISE_MAP[normalizedName]) {
    return {
      ...EXERCISE_MAP[normalizedName],
      confidence: 'exact'
    };
  }
  
  // Partial match
  for (const [key, value] of Object.entries(EXERCISE_MAP)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return {
        ...value,
        confidence: 'partial'
      };
    }
  }
  
  // No match found
  return {
    id: null,
    title: exerciseName,
    confidence: 'unmapped'
  };
}

/**
 * Map all exercises in a workout
 * @param {Array} exercises - Array of exercise objects
 * @returns {Object} Mapping results with mapped exercises and stats
 */
function mapWorkoutExercises(exercises) {
  const mappedExercises = [];
  const unmappedExercises = [];
  
  for (const exercise of exercises) {
    const mapping = mapExercise(exercise.exercise_name);
    
    const mappedExercise = {
      ...exercise,
      hevy_exercise_id: mapping.id,
      hevy_exercise_title: mapping.title,
      mapping_confidence: mapping.confidence
    };
    
    mappedExercises.push(mappedExercise);
    
    if (!mapping.id) {
      unmappedExercises.push(exercise.exercise_name);
    }
  }
  
  return {
    exercises: mappedExercises,
    unmapped: unmappedExercises,
    stats: {
      total: exercises.length,
      mapped: mappedExercises.filter(e => e.hevy_exercise_id).length,
      unmapped: unmappedExercises.length
    }
  };
}

/**
 * Get all available exercise mappings
 * @returns {Object} Exercise mapping database
 */
function getExerciseMap() {
  return { ...EXERCISE_MAP };
}

module.exports = {
  mapExercise,
  mapWorkoutExercises,
  getExerciseMap,
  EXERCISE_MAP
};
