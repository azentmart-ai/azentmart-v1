const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const finalBuildDir = path.join(rootDir, "final-build");

// Delete old final-build folder
if (fs.existsSync(finalBuildDir)) {
  fs.rmSync(finalBuildDir, { recursive: true, force: true });
}

// Create new final-build folder
fs.mkdirSync(finalBuildDir, { recursive: true });

// Build root application
console.log("Building main application...");
execSync("npm run build:main", {
  cwd: rootDir,
  stdio: "inherit",
});

// Copy root build
copyFolder(
  path.join(rootDir, "build"),
  finalBuildDir
);

// Applications configuration
const apps = [
  {
    name: "instagram",
    folder: "instagram-frontend",
    command: "npm run build:instagram",
  },
  {
    name: "interview",
    folder: "interview-frontend",
    command: "npm run build:interview",
  },
  {
    name: "voice",
    folder: "voice-frontend",
    command: "npm run build:voice",
  },
  {
    name: "whatsapp",
    folder: "whatsapp-frontend",
    command: "npm run build:whatsapp",
  },
];

// Build and copy each application
apps.forEach((app) => {
  console.log(`Building ${app.name}...`);

  execSync(app.command, {
    cwd: rootDir,
    stdio: "inherit",
  });

  const source = path.join(
    rootDir,
    app.folder,
    "build"
  );

  const destination = path.join(
    finalBuildDir,
    app.name
  );

  copyFolder(source, destination);
});

console.log("All applications combined successfully!");


function copyFolder(source, destination) {

  if (!fs.existsSync(source)) {
    throw new Error(`Source folder not found: ${source}`);
  }

  fs.mkdirSync(destination, {
    recursive: true,
  });

  const files = fs.readdirSync(source);

  files.forEach((file) => {

    const sourcePath = path.join(
      source,
      file
    );

    const destinationPath = path.join(
      destination,
      file
    );

    if (
      fs.lstatSync(sourcePath).isDirectory()
    ) {

      copyFolder(
        sourcePath,
        destinationPath
      );

    } else {

      fs.copyFileSync(
        sourcePath,
        destinationPath
      );

    }

  });

}
