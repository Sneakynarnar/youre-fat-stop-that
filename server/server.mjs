import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { load_dotenv } from "./dotenv.mjs";
import { getExercises } from "./accounts.mjs";
import { uuidv4 } from "uuidv4"
import OAuth2Client from "google-auth-library";
import { init } from "./setupdatabase.mjs";
//import open from 'open';
const connect = init()
const app = express();
const port = 8080;
const client = new OAuth2Client(env_data.GOOGLE_CLIENT_ID);
const env_data = await load_dotenv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
function send(res, fp) {
  res.sendFile(path.join(__dirname, fp));
}
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
  const workoutId = uuidv4();
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

app.post('/verify', async (req, res) => {
  const token = req.body.idToken;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: load_dotenv.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    // Send a success response
    res.status(200).json({ message: 'Verification successful', userid: userid });
  } catch (error) {
    // Send an error response
    res.status(401).json({ message: 'Verification failed', error: error.toString() });
  }
});

