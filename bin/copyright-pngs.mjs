import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import * as steggy from "steggy";

// Get current directory name
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Copyright statement
let copyright = JSON.parse(
  fs.readFileSync(dirname + "/../settings.json"),
).pngCopyright;

// Get a list of all .png files
let pngs = [];
let folders = [dirname + "/../"];

console.log("");
console.log('Copyright statment set to be "' + copyright + '"');
console.log("Scanning for pngs...");

for (let i = 0; i < folders.length; i++) {
  const testFolder = folders[i];

  let dirContent = fs.readdirSync(testFolder);
  for (let j = 0; j < dirContent.length; j++) {
    try {
      if (dirContent[j].endsWith(".png")) {
        pngs.push(testFolder + dirContent[j]);
      } else if (
        dirContent[j].indexOf(".") === -1 &&
        dirContent[j] !== "node_modules"
      ) {
        folders.push(testFolder + dirContent[j] + "/");
      }
    } catch (e) {}
  }
}

console.log(pngs.length + " png files found.");
console.log("");

// Copyright each image
for (let i = 0; i < pngs.length; i++) {
  // Print file location information
  let fileName = pngs[i].split("/");
  fileName = fileName[fileName.length - 1];
  let filePath = path.resolve(pngs[i]);
  console.log("File " + (i + 1) + "/" + pngs.length);
  console.log("Name: " + fileName);
  console.log("Path: " + filePath);

  // Check for preexisting burden
  let hasBurden = false;
  let oldBurden = "";
  try {
    const image = fs.readFileSync(filePath);
    // Returns a string if encoding is provided, otherwise a buffer
    const revealed = steggy.reveal(/* optional password */)(
      image /*, encoding */,
    );

    if (revealed.toString() === copyright) {
      hasBurden = true;
    } else {
      oldBurden = ' (needs to be updated, was "' + revealed.toString() + '")';
    }
  } catch (e) {}
  console.log("Has burden: " + hasBurden + oldBurden);

  // Add burden (if it doesn't exist or needs to be updated)
  if (!hasBurden) {
    console.log("Updating...");

    const original = fs.readFileSync(filePath); // buffer
    const concealed = steggy.conceal()(original, copyright);
    fs.writeFileSync(filePath, concealed);

    console.log("Done.");
  } else {
    console.log("Moving on.");
  }

  console.log("");
}

process.exit();