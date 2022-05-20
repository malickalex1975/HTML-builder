const fsPromises = require('fs/promises');
const path = require('path');
const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');

//    копирует не только файлы но и папки со вложенными файлами
async function copyDir( s = source,  d = destination){
  try{
    await fsPromises.rm(d, {recursive:true});
    await fsPromises.mkdir(d, {recursive:true});
   
  }
  catch{
    await fsPromises.mkdir(d, {recursive:true});
  }
  
  let dirents =await fsPromises.readdir(s,{withFileTypes:true});   
  for await (let dirent of dirents){
    if (dirent.isFile()){
      let filePath = path.join(s,dirent.name.toString());
      await fsPromises.copyFile(filePath,path.join(d,dirent.name.toString()));
    }
    
    if (dirent.isDirectory()){
      await fsPromises.mkdir(path.join(d,dirent.name.toString()),{recursive:true});
      await  copyDir(path.join(s,dirent.name.toString()),path.join(d,dirent.name.toString()));
    }
  }
}
copyDir();