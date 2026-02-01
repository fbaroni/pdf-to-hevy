/**
 * Workout Parser Module
 * 
 * Parses extracted text into structured workout data.
 * 
 * @module workoutParser
 */

/**
 * Parse workout text into structured format
 * @param {string} text - Raw text from PDF extraction
 * @returns {Object} Structured workout data
 */
function parseWorkout(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input for parsing');
  }

  // Parse workout metadata
  const workoutNameMatch = text.match(/Workout:\s*(.+)/i);
  const dateMatch = text.match(/Date:\s*(.+)/i);
  
  const workoutName = workoutNameMatch ? workoutNameMatch[1].trim() : 'Imported Workout';
  const workoutDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

  // Parse exercises
  const exercises = parseExercises(text);

  return {
    routine_name: workoutName,
    workout_date: workoutDate,
    exercises: exercises
  };
}

/**
 * Parse individual exercises from text
 * @param {string} text - Workout text
 * @returns {Array} Array of exercise objects
 */
function parseExercises(text) {
  const exercises = [];
  const exerciseBlocks = text.split(/\n\s*Exercise:/i).slice(1);
  
  for (const block of exerciseBlocks) {
    const exercise = parseExerciseBlock(block);
    if (exercise) {
      exercises.push(exercise);
    }
  }
  
  return exercises;
}

/**
 * Parse single exercise block
 * @param {string} block - Text block for one exercise
 * @returns {Object|null} Exercise object or null if invalid
 */
function parseExerciseBlock(block) {
  const lines = block.trim().split('\n');
  if (lines.length === 0) return null;
  
  const exerciseName = lines[0].trim();
  
  let sets = [];
  let reps = [];
  let weights = [];
  
  // Parse sets, reps, and weights
  for (const line of lines.slice(1)) {
    if (line.match(/Sets:/i)) {
      const match = line.match(/Sets:\s*(\d+)/i);
      const setCount = match ? parseInt(match[1]) : 0;
      sets = Array(setCount).fill(0).map((_, i) => i + 1);
    } else if (line.match(/Reps:/i)) {
      const match = line.match(/Reps:\s*(.+)/i);
      if (match) {
        reps = match[1].split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
      }
    } else if (line.match(/Weight:/i)) {
      const match = line.match(/Weight:\s*(.+)/i);
      if (match) {
        weights = match[1].split(',').map(w => parseFloat(w.trim())).filter(w => !isNaN(w));
      }
    }
  }

  // Build sets array
  const setsData = sets.map((setNum, idx) => ({
    set_index: setNum,
    reps: reps[idx] || 0,
    weight_kg: weights[idx] || 0
  }));

  return {
    exercise_name: exerciseName,
    sets: setsData,
    notes: ''
  };
}

module.exports = {
  parseWorkout,
  parseExercises,
  parseExerciseBlock
};
