import { SerialPort, ReadlineParser } from 'serialport'

let quizSize = 4; // Defines size of questionnaire 

// Defines pre stored questions in questionnaire
let quizStorage = [
  "2222",
  "1212",
  "1122"
];

let trial = ""; // Defines empty string that would be sent to the microbit
let section = 0;
let temp = 0; // When determining average temp number that gets each option added to

// Determines average of what is stored in storage
for(let i = 0; i < quizStorage.length; i++){
  for(let k = 0; k < quizSize; k++){
    temp += parseInt(quizStorage[i][k]);
  }
  
  // Detemins what the average question response is and assigns to section
  if(temp / quizSize > 1.5){
    section = 2;
  } else {
    section = 1;
  }
  trial = trial + section; // Append int as string to list of averages
}


 let result = trial;
 
// When recieves from serial arduino timeout resets
var timeoutObject = null;
function restartCountdown(timeout, callback) {
  if (timeoutObject) clearTimeout(timeoutObject)
  timeoutObject = setTimeout(() => {
    timeoutObject = null
    callback()
  }, timeout * 1000)
}



// Finds which ports the arduino and microbit are connected to
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
 
  // If 60 seconds passes from the last user input
  function timeout() {
    // Send result variable the average to the microbit for example "1212"
    console.log('TIMEOUT!')
    
    // Send average from storage to the microbit
    for(let z = 0; z < 3; z++){
      microbit.write(result+'\n')  
    }
    microbit.write(result+'\n')      
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
