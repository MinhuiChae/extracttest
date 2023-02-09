const spawn = require('child_process').spawn;
const getData = (data) => {
  const str = data.toString();
  const reg = new RegExp(/\{(.*)\}/, "g");
  console.log("receive Data Match : ", str.match(reg));
}

const init = () => {
  
  const exportJsonPath = `${__dirname}\\2022-12-23-13-06-30-3220724.json`;
  const workPath = `${__dirname}\\worker.js`;
  const params = [
    `${__dirname}\\extractWorkerManager.js`,
    exportJsonPath,
    workPath
  ]
  
  const child = spawn('node', params, {shell: false, cwd:__dirname});
  child.stdout.on('data', getData);
}

init();


