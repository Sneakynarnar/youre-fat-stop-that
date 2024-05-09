import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { load_dotenv } from "./dotenv.mjs";
import { getExercises, handleUserLogin, getUser } from "./accounts.mjs";
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from "google-auth-library"; // stictly for verification
import { init } from "./setupdatabase.mjs";
import jwt from "jsonwebtoken";
import rateLimit from 'express-rate-limit';

//import open from 'open';
const connect = init()
const app = express();
const port = 8080;
const env_data = await load_dotenv();
const client = new OAuth2Client(env_data.GOOGLE_CLIENT_ID);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
const exerciseCompletionLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 1, 
  message: 'Rate limited! try again later!'
});
app.use(cookieParser);
app.use("/dashboard", authenticateToken)
app.use("/profile", authenticateToken)
app.use("/exercise", authenticateToken)
app.use("/", express.static(path.join(__dirname, "/client")));
app.use(express.json());
app.get ("/api/workouts", async (req, res) => {
  const exercises = await getExercises() 
  res.json(exercises)
})
app.get("/api/current_user", authenticateToken, async (req, res) => {
  const user = await getUser(req.user.userid);
  // console.log('user: ', user);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  console.log('user: ', user);
  res.json(user);
});

app.get("/api/profile/:id", async (req, res) => {
  const db = await connect;
  const user = await getUser(req.params.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const workoutsCreated = await db.all('SELECT * FROM WorkoutRoutines WHERE account_id = ?;', [req.params.id]);
  user.workoutsCreated = workoutsCreated.length;
  res.json(user);
});
app.post("/api/uploadworkoutroutine", authenticateToken, async (req, res) => {
  if (!req.body.accountId || !req.body.workout) {
    res.status(400).json({ status: "error", message: "Missing account_id or workout" });
    console.log('missing account_id or workout');
    
    return;
  } else if (!Array.isArray(req.body.workout)) {
    res.status(400).json({ status: "error", message: "Workout must be an array" });
    console.log('workout must be an array');
    
    return;
  } else if (Number(req.user.userid) !== req.body.accountId) {
    
    res.status(403).json({ status: "error", message: "Forbidden" });
    console.log('forbidden');
    return;
  } else {
    const status = await storeWorkout(req.body);
    if (status) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(500).json({ status: "error" });
    }
  }
});

app.get("/api/getworkoutroutine/:id", async (req, res) => {
  const db = await connect;
  const workout = await db.get('SELECT * FROM WorkoutRoutines WHERE workout_id = ?;', [req.params.id]);
  if (!workout) {
    res.status(404).json({ message: 'Workout not found' });
    return;
  }
  res.json(workout);
});

app.get("/api/communityworkoutroutines", async (req, res) => {
  const db = await connect;
  const workouts = await db.all('SELECT wr.workout_id, wr.account_id, wr.description, a.username, wr.workout_name, wr.workout_routine FROM WorkoutRoutines wr JOIN Accounts a ON wr.account_id = a.id');
  res.json(workouts);
});
app.listen(port, () => {
  startTasks();
  console.log(`Server is running on port ${port}`);
});

async function storeWorkout(workoutData) {
  const db = await connect
  const workoutId = uuidv4(); // generate a unique id for the workout
  let exerciseExists = false
  // console.log('workoutData: ', workoutData);
  for (const exercise of workoutData.workout) {
    
    exerciseExists = !!(db.get('SELECT * FROM Workouts WHERE name = ?;', [exercise]));
    if (!exerciseExists) {
      return false;
    }
  }
  db.run('INSERT INTO WorkoutRoutines (account_id, workout_routine, workout_id, workout_name, description) VALUES (?, ?, ?, ?, ?);', [workoutData.accountId, workoutData.workout.toString(), workoutId, workoutData.workoutName, workoutData.description]);
  return true;
}

app.post('/api/outside-exercise-completion', authenticateToken, async (req, res) => {
  const db = await connect;
  const time = Math.floor(req.body.time / 60); // this could be abused by the user so in production, you should calculate the time on the server, but I'm lazy.
  console.log('req.user: ', req.user);
  
  const userId = req.user.userid;
  const user = await db.get('SELECT * FROM Accounts WHERE id = ?;', [userId]);
  console.log('req.body: ', req.body);
  
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  if (time == undefined) {
    res.status(400).json({ message: 'Missing time' });
    return;
  }
  if (time == undefined) {
    res.status(400).json({ message: 'Missing distance' });
    return;
  }
  db.run('UPDATE Accounts SET total_minutes_done = total_minuted_done + ?, total_workouts = total_workouts + 1, minutestoday = minutestoday + ?, distance_travelled = distance_travelled + ? WHERE id = ?;', [time, time, distance, userId]);
});

app.post('/api/exercisecompletion', exerciseCompletionLimiter, authenticateToken, async (req, res) => { // rate limiting the exercise completion endpoint to 1 request per minute so that it's harder to abuse
  const db = await connect;
  const time = Math.floor(req.body.time / 60); // this could be abused by the user so in production, you should calculate the time on the server, but I'm lazy.
  const userId = req.body.userId;
  const user = await db.get('SELECT * FROM Accounts WHERE id = ?;', [userId]);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  if (!time) {
    res.status(400).json({ message: 'Missing time' });
    return;
  }
  const workoutRoutine = JSON.parse(workout.workoutroutine);
  const workoutTime = workoutRoutine.reduce((totalTime, exercise) => {

  db.run('UPDATE Accounts SET totalminutedone = totalminutedone + ?, totalworkoutsdone = totalworkoutsdone + 1, minutesthisweek = minutesthisweel + ?, minutestoday = minutestoday + ? WHERE id = ?;', [workoutTime, workoutTime, workoutTime, userId]);
  res.json({ message: 'Workout completed', workoutTime });
  });
});

app.get('/profile/:id', async (req, res) => {
  res.sendFile(path.join(__dirname, '/client/profile/index.html'));
});
app.post('/api/verify', async (req, res) => {
  console.log('verifying token');
  try {
    const idtoken = req.body.idToken;
    const ticket = await client.verifyIdToken({
      idToken: idtoken,
      audience: env_data.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log('env_data', env_data);
    
    const token = jwt.sign({ userid: userid }, env_data.JWT_TOKEN, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict'}) // using cookies instead of local storage to prevent XSS attacks
    // however, cookies are vulnerable to CSRF attacks which is why i set the sameSite attribute to strict
    res.json({ message: 'Successfully verified', token: token });
    const userStored = await handleUserLogin(userid, req.body.email, req.body.name, req.body.imageUrl);
    console.log('userStored: ', userStored);
  } catch (error) {
    console.log('error: ', error.toString());
    res.status(401).json({ message: 'Verification failed', error: error.toString()});
  }
  
});

function authenticateToken(req,res,next) { // middleware function
  const token = req.cookies.token;
  
  if (token == null) return res.redirect('/');
  jwt.verify(token, env_data.JWT_TOKEN, (err, user) => {
    if (err) {
      console.log('err: ', err);
      return res.redirect('/');
    }
    req.user = user;
    console.log('req.user: ', user);
    next();
  });
}

function cookieParser(req, res, next) { // writing my own cookie parsere
  req.cookies = {};
  const cookieHeader = req.headers['cookie'];
  if (cookieHeader) {
    const cookies = cookieHeader.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split('=');
      if (parts.length < 2) continue;
      const name = decodeURIComponent(parts.shift().trim()); // remove whitespace and decode the name
      const value = decodeURIComponent(parts.join('='));  // decode the value for example %20 to space
      // joining the parts back together because the value can contain an equal sign
      req.cookies[name] = value;
    }
  }
  next();
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const timeUntilMidnight = midnight - now;
  return timeUntilMidnight;
}
async function dailyUpdateUsers() {
  const db = await connect;
  db.run('UPDATE Accounts SET streak = 0 WHERE minutes_today = 0;'); // reset streak if user didn't do any exercise
  db.run('UPDATE Accounts SET streak = streak + 1 WHERE minutes_today > 0;'); // increment streak if user did exercise
  db.run('UPDATE Accounts SET minutes_today = 0;'); // reset minutes done today
  console.log("Updated users!");
}
function startTasks() {
  setTimeout(dailyUpdateUsers, getTimeUntilMidnight()); // run the daily update at midnight
  setInterval(dailyUpdateUsers, 24 * 60 * 60 * 1000); // run the daily update every 24 hours
}

