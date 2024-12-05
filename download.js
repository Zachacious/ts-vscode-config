const https = require("https");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
const { createWriteStream } = require("fs");
const { unzipSync } = require("zlib");

// Define constants
const ZIP_URL =
  "https://github.com/Zachacious/ts-vscode-config/raw/main/setup.zip";
const TEMP_DIR = path.join(os.tmpdir(), "setup_temp");
const ZIP_PATH = path.join(TEMP_DIR, "setup.zip");

function downloadFile(url, dest, callback) {
  const file = createWriteStream(dest);
  https
    .get(url, (response) => {
      if (response.statusCode !== 200) {
        return callback(
          new Error(`Failed to download file: ${response.statusCode}`)
        );
      }
      response.pipe(file);
      file.on("finish", () => file.close(callback));
    })
    .on("error", (err) => {
      fs.unlink(dest, () => callback(err));
    });
}

function extractZip(zipPath, dest) {
  const data = fs.readFileSync(zipPath);
  fs.writeFileSync(dest, unzipSync(data));
}

function runSetupScript(scriptPath) {
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing setup.js: ${error.message}`);
      return;
    }
    if (stderr) console.error(`Error output from setup.js: ${stderr}`);
    console.log(`Output from setup.js:\n${stdout}`);
  });
}

async () => {
  try {
    // Create temporary directory
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    console.log("Downloading zip...");
    downloadFile(ZIP_URL, ZIP_PATH, (err) => {
      if (err) throw err;
      console.log("Extracting zip...");
      extractZip(ZIP_PATH, TEMP_DIR);
      console.log("Running setup script...");
      runSetupScript(path.join(TEMP_DIR, "setup.js"));
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};
