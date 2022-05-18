const path = require('path');
const fsPromises = require('fs/promises');
const checkingPath = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist', 'bundle.css');
let allData;

async function mergeStyles(){
  await fsPromises.open(destination,'w');
  let dirents =await fsPromises.readdir(checkingPath,{withFileTypes:true});
  for await (let dirent of dirents){
    if (dirent.isFile()){
      let filePath = path.join(checkingPath,dirent.name.toString());
      let file = path.parse(filePath);
      let fileExt = file.ext;
      if (fileExt ==='.css'){
        const data  = await fsPromises.readFile(filePath, 'utf-8');
        allData = allData+data+'\n';
      }
    }
  }
  await fsPromises.writeFile(destination, allData);
}

mergeStyles();