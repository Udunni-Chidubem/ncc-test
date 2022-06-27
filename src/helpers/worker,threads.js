const {Worker} = require('worker_threads');
 
const worker=new Worker('./src/helpers/bootstrap.service.js')
worker.on('message',  (data)=>{
    console.log(data)
})