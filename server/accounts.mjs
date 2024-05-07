import fs from 'fs/promises'
import { init } from './setupdatabase.mjs'
const connect = init()
const jsonData = await fs.readFile('server/exercises.json')
const exercises = JSON.parse(jsonData)
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

export async function handleUserLogin(id) {
  const db = await connect;
  const userExists = await db.get('SELECT * FROM Accounts WHERE id = ?;', [id]);
  console.log('userExists', userExists);
  
  if (userExists) {
    return false;
  } else {
    console.log('Creating new user with id: ', id);
    db.run('INSERT INTO Accounts (id) VALUES (?);', [id]);
    return true
  }
}
