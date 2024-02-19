// Copy the version from the package.json to the client .env file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const packageJsonPAth = "../../package.json";

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, packageJsonPAth), "utf8"));

const envFile = path.resolve(__dirname, ".env");
// If the file doesn't exist, create it
if (!fs.existsSync(envFile)) {
  fs.writeFileSync(envFile, "VITE_APP_VERSION=0.0.0", "utf8");
}
const env = fs.readFileSync(envFile, "utf8");

const updatedEnv = env.replace(/VUE_APP_VERSION=.*(?:\n|$)/, `VITE_APP_VERSION=${packageJson.version}\n`);

fs.writeFileSync(envFile, updatedEnv, "utf8");

// Modify the generated JavaScript files
