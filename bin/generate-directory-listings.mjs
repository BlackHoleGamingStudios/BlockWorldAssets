import * as fs from 'fs';

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const getFiles = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);

function getFileStructure(path, name, curPath) {
  let folders = getDirectories(path);
  let subFolders = [];
  let files = getFiles(path);
  let fileStr = '';

  for (let i = 0; i < folders.length; i++) {
    subFolders.push(getFileStructure(path + folders[i] + '/', folders[i] + '/', curPath + folders[i] + '/'));
  }

  for (let i = 0; i < files.length; i++) {
    fileStr += '<li class="file"><a href="' + curPath + files[i] + '" target="blank">' + files[i] + '</a></li>';
  }

  return '<li class="folder">' + '<a href="' + curPath + '" target="blank">' + name + '</a><ul>' + subFolders.join('') + fileStr + '</ul></li>';
}

let listingsHTML = `<!DOCTYPE html><html><head><title>Assets directory listings</title><style>ul { list-style: none; padding-left: 25px; } body { margin: 0; display: flex; justify-content: center; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; font-size: 16px; } a { text-decoration: none; } .folder { padding-bottom: 10px; } </style></head><body><ul>${getFileStructure('./assets/', 'assets/', './')}</ul></body></html>\n`;

fs.writeFileSync("./assets/index.html", listingsHTML); 