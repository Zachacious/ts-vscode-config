# Ultimate TypeScript/VS Code/Formatting/Linting Easy Setup Script

This script automates the process of setting up the ultimate TypeScript development environment for VS Code. It installs essential VS Code extensions, sets up configuration files (such as `.prettierignore`, `.eslintignore`, and `.gitignore`), and installs the necessary development dependencies. It also configures your environment for the best TypeScript experience.

```
PLEASE NOTE: This script is intended for personal use and may not work in all environments. Use at your own risk. HEAVY work in progress and largly untested.
```

## Features

- **VS Code Extensions**: Installs extensions for Prettier, ESLint, Tailwind CSS, Auto Rename Tag, Better Comments, and more.
- **Configuration Files**: Automatically generates `.prettierignore`, `.eslintignore`, `.gitignore`, and VS Code settings.
- **Runtime Detection**: Automatically detects and configures the runtime (Node.js, Bun, or Deno) based on the environment used to run the script.
- **Dependency Installation**: Installs the necessary development dependencies (`typescript`, `eslint`, `prettier`, etc.).

## Installation

### Prerequisites

Before running the script, make sure you have one of the following runtimes installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Bun**: [Download Bun](https://bun.sh/)
- **Deno**: [Download Deno](https://deno.land/)

### Step 1: Download the Script

You can download and run the setup script using `curl` or `wget`.

**Using `curl`**:

```bash
curl -fsSL https://github.com/Zachacious/ultimate-ts-vscode-config/blob/main/setup.js -o setup.js
```

**Using `wget`**:

```bash
wget https://github.com/Zachacious/ultimate-ts-vscode-config/blob/main/setup.js -O setup.js
```

### Step 2: Run the Script

Once the script is downloaded, run it using your preferred runtime:

**For Node.js**:

```bash
node setup.js
```

**For Bun**:

```bash
bun setup.js
```

**For Deno**:

```bash
deno run --allow-write --allow-read --allow-net setup.js
```

### Step 3: Enjoy the Setup!

The script will automatically:

- Install VS Code extensions.
- Install development dependencies (`typescript`, `eslint`, `prettier`, etc.).
- Configure necessary files (`.prettierignore`, `.eslintignore`, `.gitignore`).
- Set up VS Code workspace settings.

## Configuration Files Created

- **.prettierignore**: A file to exclude specific directories and files from Prettier formatting.
- **.eslintignore**: A file to exclude specific directories and files from ESLint linting.
- **.gitignore**: Basic configuration for ignoring unnecessary files in Git.
- **VS Code settings**: Automatically configures VS Code for the best TypeScript experience.

## Runtime Detection

The script automatically detects which runtime is being used:

- If you run the script with `node`, it will install dependencies using `npm`.
- If you run the script with `bun`, it will install dependencies using `bun`.
- If you run the script with `deno`, the script will skip dependency installation, as Deno has a different package management system.

## Troubleshooting

If the script fails, check the following:

- Ensure that the required runtime (Node.js, Bun, or Deno) is installed.
- Make sure that `code` (VS Code command) is available in your terminal. You can install it from [VS Code Docs](https://code.visualstudio.com/docs/editor/command-line).
- Make sure your system allows running scripts. On Windows, you may need to enable script execution by running `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
