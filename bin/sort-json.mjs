import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import { sort } from 'json-keys-sort';
import jsonFormat from 'json-format';
import { encryptUrl } from '../js/security/urlEncrypt.mjs';

// Get current directory name
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Get a list of all .png files
let jsons = [];
let folders = [dirname + "/../"];

console.log("");
console.log("Scanning for json...");

for (let i = 0; i < folders.length; i++) {
  const testFolder = folders[i];

  let dirContent = fs.readdirSync(testFolder);
  for (let j = 0; j < dirContent.length; j++) {
    try {
      if (dirContent[j].endsWith(".json")) {
        jsons.push(testFolder + dirContent[j]);
      } else if (
        dirContent[j].indexOf(".") === -1 &&
        dirContent[j] !== "node_modules"
      ) {
        folders.push(testFolder + dirContent[j] + "/");
      }
    } catch (e) {}
  }
}

console.log(jsons.length + " json files found.");
console.log("");

// Formater settings
var formatSettings = {
  type: 'space',
  size: 2
}

// Sort and format json
for (let file in jsons) {
  console.log("Sorting "+path.resolve(jsons[file]));
  let jsonCode = sort(JSON.parse(fs.readFileSync(path.resolve(jsons[file])).toString()), true);
  
  if (path.basename(path.resolve(jsons[file])) != "package-lock.json") {
    let scan = [jsonCode];
    for (let i in scan) {
      if (Object.prototype.toString.call(scan[i]) === '[object Array]') {
        for (let j in scan[i]) {
          if (typeof scan[i][j] === 'string' && scan[i][j].startsWith('>')) {
            scan[i][j]=encryptUrl(scan[i][j].slice(1));
          } else if (typeof scan[i][j] === 'object' && scan[i][j] !== null) {
            scan.push(scan[i][j]);
          }
        }
      } else {
        for (const [key, value] of Object.entries(scan[i])) {
          if (typeof value === 'string' && value.startsWith('>')) {
            scan[i][key]=encryptUrl(scan[i][key].slice(1))
          } else if (typeof value === 'object' && value !== null) {
            scan.push(value);
          }
        }
      }
    }
  }

  let jsonCodePretty = jsonFormat(jsonCode, formatSettings)+"\n";
  
  fs.writeFileSync(path.resolve(jsons[file]), jsonCodePretty);
  console.log("Done.")
  console.log("")
}