const {stdout} = process;
const fs = require('fs');
const path = require('path');
let checkingPath = path.join(__dirname, 'secret-folder');
let file;
let filePath= checkingPath;
let fileName;
let fileExt;
let fileSize;

function checkFiles(checkingPath){
  fs.readdir(checkingPath,{withFileTypes:true}, (err,dirents) => {
    if (err) {throw err;}
    for (let dirent of dirents){
      if (dirent.isFile()){
        fs.stat(path.join(checkingPath,dirent.name.toString()), (err,stats) => {
          filePath =path.join(checkingPath,dirent.name.toString());
          file = path.parse(filePath);
          fileName=file.name;
          fileExt = file.ext;
          fileSize = stats.size;
          stdout.write(`${fileName} - ${fileExt.slice(1)} - ${fileSize} bytes; \n`);
        });
      }
    }
  });
}

checkFiles(checkingPath);