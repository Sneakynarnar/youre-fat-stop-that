import { open } from "sqlite";
import sqlite3 from "sqlite3";
/**
 *
 * @returns {sqlite3.Database.connection}
 */
async function init() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
    verbose: true,
  });
  await db.migrate({ migrationsPath: "./migrations-sqlite" });
  return db.conn;
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
  console.log("Database set up!");
}

await initDataBase();
