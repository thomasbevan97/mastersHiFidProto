import { SerialPort, ReadlineParser } from 'serialport'

let quizSize = 4;
let quizStorage = [
  "2222",
  "1212",
  "1122"
];
let trial = "";
let section = 0;
let temp = 0;

console.log(quizStorage.length);
for(let i = 0; i < quizStorage.length; i++){
  for(let k = 0; k < quizSize; k++){
    temp += parseInt(quizStorage[i][k]);
  }console.log(temp);
  if(temp / quizSize > 1.5){
    section = 2;
  } else {
    section = 1;
  }
  trial = trial + section;
  console.log(trial);
}


 let result = "1111"
 
// When recieves from serial arduino
var timeoutObject = null;
function restartCountdown(timeout, callback) {
  if (timeoutObject) clearTimeout(timeoutObject)
  timeoutObject = setTimeout(() => {
    timeoutObject = null
    callback()
  }, timeout * 1000)
}




async function findPorts(vidpidList) {
  const results = []
  let ports = await SerialPort.list()
  for (let vidpid of vidpidList) {
    let found = null
    for (let port of ports) {
      const vp = port.vendorId + ':' + port.productId
      if (vp == vidpid) {
        found = port
      }
    }
    results.push(found)
  }
  return results
}

async function run() {
  const microbitVidPid = "0d28:0204"
  const arduinoVidPid = "2341:0043"
  const ports = await findPorts([microbitVidPid, arduinoVidPid])
  const microbitDevice = ports[0]
  const arduinoDevice = ports[1]
 
  console.log('MICROBIT:' + microbitDevice.path)
  console.log('ARDUINO:' + arduinoDevice.path)
 
  const microbit = new SerialPort({ path: microbitDevice.path, baudRate: 9600 })
  const arduino = new SerialPort({ path: arduinoDevice.path, baudRate: 9600 })

  const microbitParser = microbit.pipe(new ReadlineParser())
  const arduinoParser = arduino.pipe(new ReadlineParser())
 
  microbitParser.on('data', (data) => {
    console.log('MICROBIT: ' + data)
    arduino.write(data + '\n')
  })
 
  function timeout() {
    // Send result variable the average to the microbit for example "1212"
    console.log('TIMEOUT!')
    for(let z = 0; z < 3; z++){
      microbit.write('1111'+'\n')  
    }
    microbit.write('1111'+'\n')      
  }
 
  arduinoParser.on('data', (data) => {
    console.log('ARDUINO: ' + data)
      
    restartCountdown(60, timeout)
    
    microbit.write(data + '\n')
  })
 
  console.log('Running...')
  timeout()

}

run()
