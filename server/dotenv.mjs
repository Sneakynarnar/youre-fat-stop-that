import fs from "fs/promises";
export async function load_dotenv() {
  const envKeys = {};
  try {
    const envFileContent = await fs.readFile("server/.env", "utf-8");

    const envLines = envFileContent.split("\n");

    for (const line of envLines) {
      const [key, value] = line.split("=");
      if (key && value != null) {
        envKeys[key.trim()] = value.trim();
      }
    }
  } catch (error) {
    console.log("Error reading .env file:", error);
  } finally {
    return envKeys;
  }
}
