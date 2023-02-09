const {  Worker, isMainThread } = require('worker_threads');
const os = require("os");
class workManager {
  list = [];
  cpus = this.getCpuCores();
  workThreads = new Set();
  workStatus = '';
  workProcessList = [];  
  workSuccessList = [];
  workErrorList = []; 
  workPath = '';

  constructor(list, opts) {
    this.list = list;

    if (opts.onExitCallback && opts.onExitCallback instanceof Function) {
      this.onExitCallback = opts.onExitCallback;
    }

    if(opts.workPath) {
      this.workPath = opts.workPath;
    }
  }

  getCpuCores() {
    return Number(os.cpus().length);
  }

  initWorkerThread() {
    if(isMainThread) {
      const copyList = [...this.list];
      const workSize = this.list.length;
      const threads = this.workThreads;
      const makingCpus = workSize > this.cpus ? this.cpus : workSize;
     
      const jobCountPerThread = Math.ceil(workSize / makingCpus);  
      for (let i = 0; i < makingCpus; i++) {   
        const startJobIndex = i*jobCountPerThread;
        const endJobIndex = startJobIndex + jobCountPerThread > workSize ? workSize : startJobIndex + jobCountPerThread;
        const jobList = copyList.slice(startJobIndex, endJobIndex);
        /** Thread 생성 */
        threads.add(this.addWorker(jobList));
      }
    }
  } 

  addWorker(jobList) {
    const worker = new Worker(
      this.workPath,
      {
        workerData: {
          jobList: jobList
        }
      }
    );

    worker.on('exit' , this.onExitWorker.bind(this, worker));
    worker.on('message',this.onMessageWorker.bind(this));

    return worker;
  }
  
  init() {
    this.workStatus = 'init';   
    this.workProcessList = [];  
    this.workSuccessList = [];
    this.workErrorList = []; 
  }


  onExitWorker(worker) {
    const threads = this.workThreads;    
    //threads.delete(worker);
    if ( this.workStatus === 'complete' ) return;
    if (threads.size === 0) {     
      this.threads = new Set();
      this.workStatus = 'complete';

      if (this.onExitCallback) {                
        this.onExitCallback();
      }
    } else if (this.workProcessList.length === this.workList.length) {
      this.threads = new Set();
      this._workStatus = 'complete';

      if (this.onExitCallback) {                
        this.onExitCallback();
      }
    }
  }

  onMessageWorker(msg) {
    const json = JSON.parse(msg);
    if (json.success === true) {
      this.processingCallback(json);
      if (this._onProcessingCallback) {
        this._onProcessingCallback(json);
      }
    } else {
      this.processingCallback(json);
      if (this._onProcessingCallback) {
        this._onProcessingCallback(json);
      }
    }
  }

  start() {
    const threads = this.workThreads;
    for (let worker of threads) {
      worker.postMessage('start');
    }
  }
}

module.exports = workManager;