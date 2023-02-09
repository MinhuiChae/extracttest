const {parentPort, workerData } = require('worker_threads');
const spawn = require('child_process').spawn;
const isMxfExtension = (path) => {
  return path.toUpperCase().indexOf('.MXF') > -1;
}

const getReplaceStr = (path) => {
  return isMxfExtension(path) === true ? 
    'TAG:comment_sbs_content_id=' :
    'TAG:comment=';
}

const getJobArgs = (jobInfo) => {
  //console.log("jobInfo> ", jobInfo);
  const formatTag = 
    isMxfExtension(jobInfo.path) === true ? 
    'format_tags=comment_sbs_content_id' : 
    'format_tags=comment';
  
  return [
    '-hide_banner',
    '-show_entries',
    formatTag,
    '-i',
    jobInfo.path,
  ];
}

let jobList = [];
let threadId = '';
const cwd = '/';

const completeSbsIds = [];
const completedJobList = [];
let startIndex = 0;
let useFfprobe = workerData.type === 'ffprobe2' ? true : true;


const proc = async (jobInfo) => {
  

  // const args = getJobArgs(jobInfo); 

  // jobInfo.step = 1; 

  // try {
  //   const child = spawn('ffprobe', args , {shell: false, cwd: cwd});
  //   child.stdout.on('data', (data) => {
  //     jobInfo.step = 2;  
  //     const lineData = data.toString().split('\r\n');
  //     const sbs_id = useFfprobe ? lineData[1].replace(getReplaceStr(jobInfo.path),'') : lineData[0];
   

  //     if (sbs_id.toString().indexOf("FORMAT") > -1) {
  //       parentPort.postMessage(JSON.stringify({
  //         success: false,
  //         id: 'null',
  //         nodeId: jobInfo.nodeId,
  //         path: jobInfo.path,
  //         name: jobInfo.name,
  //       }));
  //       completeSbsIds.push('null'); 
          
  //     } else {
  //       parentPort.postMessage(JSON.stringify({
  //         success: true,
  //         id: sbs_id,
  //         nodeId: jobInfo.nodeId,
  //         path: jobInfo.path,
  //         name: jobInfo.name,
  //       }));
  //       completeSbsIds.push(sbs_id.toString());
  //       completedJobList.push(jobInfo);
  //     }				

  //     if (completeSbsIds.length === jobList.length) {
  //       parentPort.close(); // Exit 가 호출된다.
  //     } 
  //   })

  //   child.on('close', (code) => {
  //     jobInfo.step = 4;
  //   })

  //   child.on('error', (code) => {
  //     jobInfo.step = 4;
  //   })

  //   child.on('exit', (data) => {  
  //     if (jobInfo.step === 1){   
  //       parentPort.postMessage(JSON.stringify({
  //         success: false,
  //         id: 'null',
  //         nodeId: jobInfo.nodeId,
  //         path: jobInfo.path,
  //         name: jobInfo.name,
  //       }));
  //       completeSbsIds.push('null');
  //     } else {
  //       jobInfo.step = 3;
  //     } 
      
  startIndex++;

      
     
      if (jobList[startIndex]) {
        proc(jobList[startIndex])
      } else {
        parentPort.close();
      }
  //   })	
  // } catch(err){
  //   console.log("Exception: ", err)
  // }
}

parentPort.on('message', (message) => {
  jobList = workerData.jobList;
 
  proc(jobList[startIndex]);
})
