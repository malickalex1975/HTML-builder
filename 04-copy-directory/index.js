const fsPromises = require('fs/promises');
const path = require('path');
const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');

async function copyDir(){
  await fsPromises.mkdir(destination,{recursive:true});

  const files = await fsPromises.readdir(source);
  for(let file of files){
    await fsPromises.copyFile(path.join(source,file),path.join(destination,file));
  }
}
copyDir();