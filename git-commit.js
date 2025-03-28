/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt user for the commit message
rl.question("Enter your commit message: ", (commitMessage) => {
  if (!commitMessage) {
    console.error("Error: Please provide a commit message.");
    console.log('Usage: node push.js "Your commit message"');
    process.exit(1);
  }

  // Function to execute commands and handle their output
  const executeCommand = (command, successMessage, isPushCommand = false) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
          return;
        }

        if (isPushCommand && stderr && stderr.includes("main -> main")) {
          console.log(`Git Push Success: ${stderr}`);
          resolve(stdout);
          return;
        }

        if (stderr) {
          reject(`Stderr: ${stderr}`);
          return;
        }

        if (stdout) {
          console.log(successMessage, stdout);
        }
        resolve(stdout);
      });
    });
  };

  // Execute git add
  executeCommand("git add .", "Files added successfully:")
    .then(() =>
      executeCommand(
        `git commit -m "${commitMessage}"`,
        "Commit message added:"
      )
    )
    .then((commitOutput) => {
      console.log("Commit Output:", commitOutput);
      return executeCommand(
        "git push",
        "Push to remote repository successful:",
        true
      );
    })
    .then(() => {
      // Run npm run dev without prefixing "Server Output:"
      const devProcess = exec("npm run dev");

      devProcess.stdout.on("data", (data) => {
        process.stdout.write(data); // Directly output without prefix
      });

      devProcess.stderr.on("data", (data) => {
        process.stderr.write(data); // Directly output without prefix
      });

      devProcess.on("close", (code) => {
        console.log(`Server process exited with code ${code}`);
        rl.close();
      });
    })
    .catch((error) => {
      console.error(error);
      rl.close();
    });
});
