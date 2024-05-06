import sqlite3 from 'sqlite3';
import fs from 'fs/promises'
import { open } from 'sqlite';
/**
 * Initializes the database by opening a connection.
 * @returns {Promise<sqlite3.Database>} A promise that resolves to the opened database connection.
 */
export async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  return db;
}
console.log("Setting up database...");
const connect = init();

/**
 * Initialises the database.
 */
async function initDataBase() {
  const db = await connect;
  await db.run("DROP TABLE IF EXISTS WorkoutRoutines;");
  await db.run("DROP TABLE IF EXISTS Workouts;");
  await db.run("DROP TABLE IF EXISTS Accounts;");
  
  await db.run(`CREATE TABLE Accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  );`);

  await db.run(`CREATE TABLE Workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type INTEGER NOT NULL,
    base_time Integer,
    base_reps INTEGER,
    average_rep INTEGER
  );`);

  await db.run(`CREATE TABLE WorkoutRoutines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    workoutroutine TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Accounts(id),
    FOREIGN KEY (workout_id) REFERENCES Workouts(id)
  );`);
  console.log("Database set up!");
}

export async function exerciseFromJson() {
  const exerciseData = JSON.parse(await fs.readFile('./server/exercises.json', 'utf-8'));
  const db = await connect;
  for (const [workoutCategory, categoryData] of Object.entries(exerciseData)) {
    for (const [workoutName, workoutData] of Object.entries(categoryData.activities)) {

      await db.run(`INSERT INTO Workouts (name, description, category, type, base_time, base_reps, average_rep) VALUES (?, ?, ?, ?, ?, ?, ?);`, [workoutName, workoutData.description, workoutCategory, workoutData.type, workoutData.base_time, workoutData.base_reps, workoutData.average_rep]);
    }
  }
}

await initDataBase();
await exerciseFromJson();
