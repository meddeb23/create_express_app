#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.log("you have to provide a name to your app.");
  console.log("For example :");
  console.log("       npx create_express_app my-app");
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/meddeb23/create_express_app.git";

// try {
//   fs.mkdirSync(projectPath);
// } catch (err) {
//   if (err.code === "EEXIST") {
//     console.log(
//       `The file ${projectName} already exist in the current directory, please give it another name.`
//     );
//   } else {
//     console.log(error);
//   }
//   process.exit(1);
// }

async function main() {
  try {
    console.log("Downloading files...");
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    console.log("Installing dependencies...");
    execSync("npm install");

    console.log("Removing useless files");
    execSync("npx rimraf ./.git");
    fs.rmSync(path.join(projectPath, "bin"), { recursive: true });

    console.log("cleaning up");
    let package_json = fs.readFileSync(
      path.join(currentPath, "package.json"),
      "utf-8"
    );
    package_json = JSON.parse(package_json);
    (package_json.name = projectPath), path.basename(projectPath);
    delete package_json.bin;
    fs.writeFileSync(
      path.join(currentPath, "package.json"),
      JSON.stringify(package_json),
      "utf-8"
    );

    console.log("The installation is done, this is ready to use !");
  } catch (error) {
    console.log(error);
  }
}
// main();
