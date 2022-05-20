const path = require('path');
const fsPromises = require('fs/promises');
const destination = path.join(__dirname, 'project-dist');
const stylesSource =path.join(__dirname,'styles');
const componentsSource =path.join(__dirname,'components');
const assetsSource =path.join(__dirname,'assets');
const assetsDestination = path.join(__dirname, 'project-dist','assets');
let styleData ='';

async function createDir(){
  try{
    await fsPromises.rm(destination, {recursive:true});
    await fsPromises.mkdir(destination, {recursive:true});
  }
  catch{
    await fsPromises.mkdir(destination, {recursive:true});
  }
  await fsPromises.mkdir(destination,{recursive:true});
  await fsPromises.mkdir(path.join(destination,'assets'),{recursive:true});
  await fsPromises.open(path.join(destination,'index.html'),'w');
  await fsPromises.open(path.join(destination,'style.css'),'w');

}

async function mergeStyles(){ 
  let dirents =await fsPromises.readdir(stylesSource,{withFileTypes:true});
  for await (let dirent of dirents){
    if (dirent.isFile()){
      let filePath = path.join(stylesSource,dirent.name.toString());
      let file = path.parse(filePath);
      let fileExt = file.ext;
      if (fileExt ==='.css'){
        const data  = await fsPromises.readFile(filePath, 'utf-8');
        styleData = styleData+data.trim() +'\n';
      }
    }
  }
  await fsPromises.writeFile(path.join(destination,'style.css'), styleData);
}

async function copyDir(source,destination){
  let dirents =await fsPromises.readdir(source,{withFileTypes:true});   
  for await (let dirent of dirents){
    if (dirent.isFile()){
      let filePath = path.join(source,dirent.name.toString());
      await fsPromises.copyFile(filePath,path.join(destination,dirent.name.toString()));
    }
    
    if (dirent.isDirectory()){
      await fsPromises.mkdir(path.join(destination,dirent.name.toString()),{recursive:true});
      await  copyDir(path.join(source,dirent.name.toString()),path.join(destination,dirent.name.toString()));
    }
  }
}
 
async function readHTML(){

  const template = await fsPromises.readFile(path.join(__dirname,'template.html'), 'utf-8');
  let templateList = template.split('{{');
  for(let i=0;i < templateList.length;i++){
    if (templateList[i].includes('}}')){
      let rest = templateList[i].slice(templateList[i].indexOf('}}')+2);
      let tmp = templateList[i].slice(0,templateList[i].indexOf('}}'));
      try{
        let insertComponent= await fsPromises.readFile(path.join(componentsSource,`${tmp}.html`));
        templateList[i]=insertComponent + rest ;
      }
      catch {
        process.stdout.write(`в папке components не обнаружен файл ${tmp}.html. Продолжаем без него.`);
        templateList[i]= rest;
      }

    }
  }
  const indexFile = templateList.join('');
  await fsPromises.writeFile(path.join(destination,'index.html'), indexFile);
}
run();

async function run(){
  await createDir();
  await mergeStyles();
  await copyDir(assetsSource,assetsDestination);
  await readHTML();
}