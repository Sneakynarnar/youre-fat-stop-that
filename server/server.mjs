import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { load_dotenv } from "./dotenv.mjs";
import { getExercises } from "./accounts.mjs";

//import open from 'open';
const app = express();
const port = 8080;
const env_data = await load_dotenv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));
function send(res, fp) {
  res.sendFile(path.join(__dirname, fp));
}
app.use("/", express.static(path.join(__dirname, "/client")));
app.use(express.json());
app.get("/", (req, res) => {
  send(res, "/client/index.html");
});
app.get ("/api/workouts", async (req, res) => {
  const exercises = await getExercises()
  res.json(exercises)
})

app.post("/googleauth"),
  async (req, res) => {
    googleAuth(req.body);
  };
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// open('http://localhost:8080', { app: 'chrome' });
