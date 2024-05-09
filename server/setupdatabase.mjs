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

const connect = init();

/**
 * Initialises the database.
 */
export async function initDataBase() {
  console.log("Setting up database...");

  const db = await connect;
  await db.run("DROP TABLE IF EXISTS WorkoutRoutines;");
  await db.run("DROP TABLE IF EXISTS Workouts;");
  await db.run("DROP TABLE IF EXISTS Accounts;");
  await db.run(`CREATE TABLE IF NOT EXISTS Accounts (
    id BIGINT PRIMARY KEY,
    streak INTEGER NOT NULL DEFAULT 0,
    username TEXT,
    email TEXT,
    image TEXT,
    total_minutes_done INTEGER NOT NULL DEFAULT 0,
    total_workouts INTEGER NOT NULL DEFAULT 0,
    minutes_today INTEGER NOT NULL DEFAULT 0,
    distance_travelled INTEGER NOT NULL DEFAULT 0,
    date_created TEXT DEFAULT CURRENT_TIMESTAMP
  );`); //TODO: total workouts created

  await db.run(`CREATE TABLE IF NOT EXISTS Workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type INTEGER NOT NULL,
    base_time Integer,
    base_reps INTEGER,
    average_rep INTEGER
  );`);

  await db.run(`CREATE TABLE IF NOT EXISTS WorkoutRoutines (
    workout_id text PRIMARY KEY,
    account_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    workout_name TEXT NOT NULL,
    workout_routine TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Accounts(id),
    FOREIGN KEY (workout_id) REFERENCES Workouts(id)
  );`);
  console.log("Database set up!");

  await db.run(`INSERT INTO Accounts (id, username, email, image, total_minute_done, total_workouts_done, minutes_today, streak) VALUES (109595868691087100000, 'Sneaky', 'sneakynarnar@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocKGJIIVSs4R6RCLquIdxsGIUw-grGE_A4eamo3PWKhi7yCsU-8=s96-c', 5000, 300, 20, 100);`);

  for (let i = 0; i < 10; i++) {
    const username = `User${i}`;
    const email = `user${i}@example.com`;
    const image = `https://dummyimage.com/200x200`;
    const totalMinutesDone = Math.floor(Math.random() * 1000);
    const totalWorkouts = Math.floor(Math.random() * 50);
    const minutesToday = Math.floor(Math.random() * 60);
    const streak = Math.floor(Math.random() * 150);

    await db.run(`INSERT INTO Accounts (id, username, email, image, total_minutes_done, total_workouts, minutes_today, streak, distance_travelled) VALUES (${i}, '${username}', '${email}', '${image}', ${totalMinutesDone}, ${totalWorkouts}, ${minutesToday}, ${streak});`);
  }




}

export async function exerciseFromJson() {
  const exerciseData = JSON.parse(await fs.readFile('./server/exercises.json', 'utf-8'));
  const db = await connect;
  try {
  for (const [workoutCategory, categoryData] of Object.entries(exerciseData)) {
    for (const [workoutName, workoutData] of Object.entries(categoryData.activities)) {
      db.run(`INSERT INTO Workouts (name, description, category, type, base_time, base_reps, average_rep) VALUES (?, ?, ?, ?, ?, ?, ?);`, [workoutName, workoutData.description, workoutCategory, workoutData.type, workoutData.base_time, workoutData.base_reps, workoutData.average_rep]);
    }
  }
  } catch (error) {
    console.error(error);
    }
  }

// await exerciseFromJson();
