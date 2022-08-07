#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.log("you have to provide a name to your module.");
  console.log("For example :");
  console.log("       npx create_express_app my-app");
  process.exit(1);
}

const fileType = process.argv.find((i) => i === "--ts") ? "ts" : "js";

const moduleName = process.argv[2];
const currentPath = process.cwd();
const modulePath = path.join(currentPath, moduleName);
const name = path.basename(modulePath);

try {
  fs.mkdirSync(modulePath);
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      `The file ${moduleName} already exist in the current directory, please give it another name.`
    );
  } else {
    console.log(err);
  }
  process.exit(1);
}

async function main() {
  try {
    const content = require("./snippits.json");
    process.chdir(modulePath);
    content.forEach((file) => {
      file.content = file.content.replaceAll("$1", name);
      file.content = file.content.replaceAll(
        "$2",
        name[0].toUpperCase() + name.substring(1)
      );
      file.name = file.name.replaceAll("$1", name);
      fs.writeFileSync(`${file.name}.${fileType}`, file.content || "");
    });
    console.log(`${name} is created!`);
  } catch (error) {
    console.log(error);
  }
}

main();
