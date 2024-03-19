import fs from 'fs/promises'
const exercises = JSON.parse(fs.readFile('exercises.json'))
/** 
 * Gets all the excercises that are in the app if no category is specified. If one is specified it shows the info about that particular
 * category.
 * @param {string} category - Category which is currently either cardio, outside or weights.
 * @returns {object} Object including relevant excercises 
 */
export async function getExercises(category) {
  
  if (category == undefined) {
    return exercises
  }

  return exercises[category] !== undefined ? exercises[category] : {}
}

async function getExerciseActivities(exercise) {
  return exercises[exercise].activities 
}

export async function generatePersonalisedExercises(userID, time, exercise) { // instead of figuring out what the user wants let user pick the excercises
  const personalisedExercises = {
    warmup_routine: [],
    excercise_routine: []
  }
  for(const exercise in getExerciseActivities("warmup"))
    personalisedExercises.warmup_routine.push(exercise)
}