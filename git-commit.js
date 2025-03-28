const { exec } = require("child_process");
const readline = require("readline");

// Set up readline to get the commit message from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to execute shell commands
const execPromise = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr || error.message}`);
      } else {
        resolve(stdout);
      }
    });
  });

// Prompt for commit message
rl.question("Enter your commit message: ", async (message) => {
  try {
    // Stage all changes
    console.log("Staging files...");
    await execPromise("git add .");

    // Commit with the provided message
    console.log("Committing changes...");
    await execPromise(`git commit -m "${message}"`);

    // Push to the remote repository
    console.log("Pushing to remote repository...");
    await execPromise("git push");

    // Run the development server
    console.log("Running the development server...");
    await execPromise("npm run dev");

    console.log(
      "Successfully committed, pushed, and started the development server."
    );
  } catch (error) {
    console.error(`Error: ${error}`);
  } finally {
    rl.close();
  }
});
