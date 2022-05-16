const {stdout} = process;
const fs = require('fs');
const path = require('path');
const checkingPath = path.join(__dirname, 'secret-folder');

function checkFiles(checkingPath){
  fs.readdir(checkingPath,{withFileTypes:true}, (err,dirents) => {
    if (err) {throw err;}
    for (let dirent of dirents){
      if (dirent.isFile()){
        fs.stat(path.join(checkingPath,dirent.name.toString()), (err,stats) => {
          let filePath =path.join(checkingPath,dirent.name.toString());
          let file = path.parse(filePath);
          let fileName=file.name;
          let fileExt = file.ext;
          let fileSize = stats.size;
          stdout.write(`${fileName} - ${fileExt.slice(1)} - ${fileSize} bytes; \n`);
        });
      }
    }
  });
}

checkFiles(checkingPath);