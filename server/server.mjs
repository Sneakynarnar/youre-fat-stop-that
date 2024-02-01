import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { load_dotenv } from './dotenv.mjs';
//import open from 'open';
const app = express();
const port = 8080;
const env_data = await load_dotenv();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(path.dirname(__filename));

// Serve static files from the "client" directory
app.use('/', express.static(path.join(__dirname, '/client')));
app.use(express.json())


// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});
// Route for the dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dashboard/dashboard.html'));
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post('/googleauth'), async (req, res) => {
  googleAuth(req.body);
}

// open('http://localhost:8080', { app: 'chrome' });