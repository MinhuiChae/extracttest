const jsonPath = process.argv[2];
const workPath = process.argv[3];
const fs = require('fs');
const workerManager = require('./workerManager');
let jobList = [];

if(!fs.existsSync(jsonPath)) {
  console.log(JSON.stringify({
    status: 'error',
    msg: '분석할 JSON 파일을 찾지 못함',
  }));
  exit;
} else {
  const jsonFile = fs.readFileSync(jsonPath, 'utf8');
  jobList = JSON.parse(jsonFile);
}

const onExitCallBack = () => {
  sendMessage(JSON.stringify({
    status: 'complete',
    msg: '작업이 완료되었습니다.',
    data: {
      success: workmanager.workSuccessList
    },
  }));
}

const workmanager = new workerManager(jobList, {
  workPath: workPath,
  onExitCallback: onExitCallBack
});

workmanager.init();
workmanager.initWorkerThread();
workmanager.start();

