const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const checkingPath = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist', 'bundle.css');

fs.access(destination, err => {
  if (err) {
    fs.open(destination, 'a+', err => {
      if (err) throw err;
    });
  }
});

fs.readdir(checkingPath,{withFileTypes:true}, (err,dirents) => {
  if (err) {throw err;}
  for (let dirent of dirents){
    if (dirent.isFile()){
      let filePath = path.join(checkingPath,dirent.name.toString());
      let file = path.parse(filePath);
      let fileExt = file.ext;
      if (fileExt ==='.css'){
        createBundle(filePath);
      }
    }
  }
});

async function createBundle(cssFilePath){
  const data  = await fsPromises.readFile(cssFilePath, 'utf-8');
  await fsPromises.appendFile(destination, data);
}