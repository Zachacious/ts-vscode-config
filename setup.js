#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Helper to run shell commands
const runCommand = (command) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

// Helper to check and append to a file
const appendToFile = (filePath, content) => {
  if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, "utf8");
    if (!existingContent.includes(content)) {
      fs.appendFileSync(filePath, content);
    }
  } else {
    fs.writeFileSync(filePath, content);
  }
};

// detect os
const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";
const isLinux = process.platform === "linux";

// detect vscode installed
const isVscodeInstalled = () => {
  const command = isWindows ? "code.cmd" : "code";
  try {
    execSync(`${command} --version`);
    return true;
  } catch (error) {
    return false;
  }
};

// Detect runtime based on how the script is being executed
const detectRuntime = () => {
  const args = process.argv[0]; // The first argument is the runtime command
  console.log("args", args);
  if (args.includes("bun")) {
    return "bun";
  }
  if (args.includes("deno")) {
    return "deno";
  }
  if (args.includes("node")) {
    return "node";
  }
  console.error("Unsupported runtime. Please run with Node.js, Bun, or Deno.");
  process.exit(1);
};

// Main setup script
const setup = async () => {
  console.log("Setting up the ultimate TypeScript environment...");

  // if vscode is not installed, prompt user to install it
  if (!isVscodeInstalled()) {
    console.log(
      "Please install Visual Studio Code before running this script."
    );
    process.exit(1);
  }

  // Detect runtime
  const runtime = detectRuntime();
  // const runtime = await askRuntime();
  console.log("Using runtime:", runtime);

  // Install VS Code extensions
  console.log("Installing VS Code extensions...");
  const extensions = [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "rbbit.typescript-hero",
    "christian-kohler.path-intellisense",
    "coenraads.bracket-pair-colorizer-2",
    "eamodio.gitlens",
    "rvest.vs-code-prettier-eslint",
    "usernamehw.errorlens",
    "bradlc.vscode-tailwindcss",
    "amatiasq.sort-imports",
    "formulahendry.auto-rename-tag",
    "aaron-bond.better-comments",
  ];

  const command = isWindows ? "code.cmd" : "code";
  runCommand(`${command} --install-extension ${extensions.join(" ")}`);

  // Install dependencies
  console.log("Installing dependencies...");
  const devDependencies = [
    "typescript",
    "eslint",
    "prettier",
    "eslint-plugin-import",
    "eslint-plugin-unused-imports",
    "eslint-plugin-security",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "prettier-plugin-tailwindcss",
  ];

  if (runtime === "node") {
    runCommand(`npm install --save-dev ${devDependencies.join(" ")}`);
  } else if (runtime === "bun") {
    runCommand(`bun add -d ${devDependencies.join(" ")}`);
  } else if (runtime === "deno") {
    console.log(
      "Note: Deno manages dependencies differently; skipping npm packages."
    );
  }

  // Package.json scripts
  console.log("Ensuring package.json scripts...");
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.scripts = {
      ...packageJson.scripts,
      format: packageJson.scripts?.format || "prettier --write .",
      lint: packageJson.scripts?.lint || "eslint .",
      "type-check": packageJson.scripts?.["type-check"] || "tsc --noEmit",
      "lint:fix": packageJson.scripts?.["lint:fix"] || "eslint . --fix",
      "sort:imports":
        packageJson.scripts?.["sort:imports"] || "tsc && prettier --write .",
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // .prettierignore
  console.log("Setting up .prettierignore...");
  const prettierIgnoreContent = `
node_modules
dist
build
.vscode
*.log
*.lock
`.trim();
  appendToFile(".prettierignore", `${prettierIgnoreContent}\n`);

  // .eslintignore
  console.log("Setting up .eslintignore...");
  const eslintIgnoreContent = `
node_modules
dist
build
*.log
*.lock
`.trim();
  appendToFile(".eslintignore", `${eslintIgnoreContent}\n`);

  // .gitignore
  console.log("Ensuring .gitignore...");
  const gitIgnoreContent = `
node_modules/
dist/
build/
.env
*.log
*.lock
`.trim();
  appendToFile(".gitignore", `${gitIgnoreContent}\n`);

  // VS Code settings
  console.log("Configuring VS Code workspace settings...");
  const vscodeDir = path.join(process.cwd(), ".vscode");
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
  }
  const vscodeSettingsPath = path.join(vscodeDir, "settings.json");
  const vscodeSettings = {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "eslint.format.enable": true,
    "typescript.tsdk": "node_modules/typescript/lib",
    "tailwindCSS.includeLanguages": {
      typescript: "javascript",
      typescriptreact: "javascript",
    },
    "files.exclude": {
      "**/node_modules": true,
      "**/dist": true,
      "**/build": true,
    },
  };
  if (fs.existsSync(vscodeSettingsPath)) {
    const existingSettings = JSON.parse(
      fs.readFileSync(vscodeSettingsPath, "utf8")
    );
    fs.writeFileSync(
      vscodeSettingsPath,
      JSON.stringify({ ...existingSettings, ...vscodeSettings }, null, 2)
    );
  } else {
    fs.writeFileSync(
      vscodeSettingsPath,
      JSON.stringify(vscodeSettings, null, 2)
    );
  }

  console.log("Setup complete! 🚀");
};

setup();
