import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { load_dotenv } from "./dotenv.mjs";
import { getExercises, handleUserLogin } from "./accounts.mjs";
import uuidv4 from "uuidv4";
import { OAuth2Client } from "google-auth-library"; // stictly for verification
import { init } from "./setupdatabase.mjs";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
//import open from 'open';
const connect = init()
const app = express();
const port = 8080;
const env_data = await load_dotenv();
const client = new OAuth2Client(env_data.GOOGLE_CLIENT_ID);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
function send(res, fp) {
  res.sendFile(path.join(__dirname, fp));
}

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

app.post("/api/uploadworkout", async (req, res) => {
  const status = await storeWorkout(req.body);

  if (status) {
    res.json({ status: "success" });
  } else {
    res.json({ status: "error" });
  }
});

app.post("/googleauth"),
  async (req, res) => {
    googleAuth(req.body);
  };
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


async function storeWorkout(workoutData) {
  const db = await connect
  const workoutId = uuidv4(); // generate a unique id for the workout
  let exerciseExists = false
  for (const exercise of workoutData.workout) {
    
    exerciseExists = !!(db.get('SELECT * FROM Workouts WHERE name = ?;', [exercise]));
    if (!exerciseExists) {
      return false;
    }
  }
  db.run('INSERT INTO WorkoutRoutines (account_id, wourkoutroutine, workout_id) VALUES (?, ?);', [workoutData.account_id, workoutData.workout.toString(), workoutId]);
  return true;
}

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
    const token = jwt.sign({ userid: userid }, env_data.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict'}) // using cookies instead of local storage to prevent XSS attacks
    // however, cookies are vulnerable to CSRF attacks which is why i set the sameSite attribute to strict
    res.json({ message: 'Successfully verified', token: token });
    const userStored = await handleUserLogin(userid);
    console.log('userStored: ', userStored);
    
  } catch (error) {
    console.log('error: ', error.toString());
    
    res.status(401).json({ message: 'Verification failed', error: error.toString()});
  }
  
});

function authenticateToken(req,res,next) { // middleware function
  const token = req.cookies.token;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, env_data.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    
    next();
  });
}

// function cookieParser(req, res, next) {
//   const cookieHeader = req.headers['cookie'];
//   console.log('cookieHeader: ', cookieHeader);
//   const cookies = cookieHeader.split('; ');
//   req.cookies = cookies.reduce((acc, cookie) => {
//     const [key, value] = cookie.split('=');
//     acc[key] = value;
//     return acc;
//   }, {});
//   next();
// }

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
