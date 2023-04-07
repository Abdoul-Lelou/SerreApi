const express = require('express');

const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');


const cors = require('cors')

const routes = require('./routes/route');
const serreRoute = require('./routes/serreRouter')
const arrosageRoute = require('./routes/arrosageRouter')


const databaseLink = process.env.DATABASE_URL

mongoose.connect(databaseLink);
const database = mongoose.connection

const app = express();

app.use(cors({origin: '*'}));


app.use(express.json());
app.use(bodyParser.json());

app.use('/api', routes)
app.use('/', serreRoute)
app.use('/', arrosageRoute)



database.on('error', (error) => {
   console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

module.exports = database;


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const serre = require('./models/serre');
const serreRouter = require('./routes/serreRouter');
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
// const port2 = new SerialPort('/dev/ttyUSB0', { baudRate: 115200 });
const parser= port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

 



port.on('open', () => {
  io.on('connection', (socket) => {
    
    socket.on('isOn', (msg) => {
      console.log('lampe: ' + msg);
      port.write("1")
    });

    socket.on('isOff', (msg) => {
      console.log('lampe: ' + msg);
      port.write("0")
    });

    socket.on('isWater', (msg) => {
      console.log('water: ' + msg);
      port.write("2")
    });

    socket.on('noWater', (msg) => {
      console.log('water: ' + msg);
      port.write("3")
    });

    socket.on('noFan', (msg) => {
      console.log('fan: ' + msg);
      port.write("4")
    });

    socket.on('isFan', (msg) => {
      console.log('fan: ' + msg);
      port.write("5")
    });

    socket.on('openDoor', (msg) => {
      console.log('door: ' + msg);
      port.write("6")
    });

    socket.on('closeDoor', (msg) => {
      console.log('door: ' + msg);
      port.write("7")
    });
  });
});


// port2.on('open', () => {
//   io.on('connection', (socket) => {
    

//     socket.on('isWater', (msg) => {
//       console.log('water: ' + msg);
//       port.write("1")
//     });

//     socket.on('noWater', (msg) => {
//       console.log('water: ' + msg);
//       port.write("0")
//     });
//   });
// });

parser.on('data', (data) => {

  console.log("attente");
  let dataStr = data.toString();
  let matin ="", soir= "", dureMatin="", dureSoir="";

  try {
    let jsonData = JSON.parse(dataStr)

    // If parsing succeeds, process the JSON data
    console.log('Received JSON:', jsonData);

    if(jsonData){

      io.emit('temp', `${jsonData.temp}`);
      io.emit('hum', `${jsonData.hum}`);
      io.emit('lum', `${jsonData.lum}`);
      io.emit('sol', `${jsonData.sol}`);
      io.emit('buzzer', `${jsonData.buzzer}`);
      io.emit('toit', `${jsonData.toit}`);
      io.emit('door', `${jsonData.door}`);
    
      let tempEtHum = { 
        'temp': jsonData.temp, 
        'hum': jsonData.hum, 
        'dateInsertion': new Date(), 
        'lum': jsonData.lum,
        'sol': jsonData.sol,
      };
      //Connexion a mongodb et insertion Temperature et humidite
      //  serre.save(tempEtHum)

      var datHeure = new Date();
      var min = datHeure.getMinutes();
      var heur = datHeure.getHours(); //heure
      var sec = datHeure.getSeconds();

      const arrosageCollection = database.collection('arrosages');

     // const collection = client.db('<database>').collection('<collection>');

     arrosageCollection.findOne({ matin: '7' }, function(err, result) {
    if(err) {
      console.log('Error finding document:', err);
      return;
    }
    matin = result.matin;
    soir = result.soir;
    dureMatin = result.dureMatin
    dureSoir = result.dureSoir

    console.log('Found document:',dureSoir);
    // arrosageCollection.close();
console.log(min);
    if((heur == matin  && min == 24 && sec == 00)){
      port.write("2")
      console.log("allumer");
      setTimeout(() => {
        port.write("3")
        console.log("eteindre");
      }, dureMatin);

    }else if((heur == soir  && min == 24 && sec == 00)){
      console.log("allumer");
      port.write("2")
      setTimeout(() => {
        port.write("3")
        console.log("eteindre");
      }, dureSoir);
    }
  });

  // console.log(dureSoir);

      // console.log( arrosageCollection.find({},function(err, result){
      //   if(err) throw err
      //   return result
      // }));
      // arrosageCollection.find()
      // collection.find().map(e=> console.log(e))
      // (tempEtHum, function(err, res) {
      //   if (err) throw err;
      //   console.log("Data inserted successfully!");
      // });
        
      if((heur == 08 && min == 00 && sec == 00) || (heur == 19 && min == 00 && sec == 00)){
        
        setTimeout(()=>{
          const collection = database.collection('serres');
      
          collection.insertOne(tempEtHum, function(err, res) {
            if (err) throw err;
            console.log("Data inserted successfully!");
          });
        }, 1000);
      }
      // else if(){
          
      // }
        // console.log(serre.find())


      if( jsonData.rfid == true){
        token = jwt.sign(
              { userId: 'admin@gmail.com' }, // id et email de la personne connectée
                process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
              { expiresIn: "1h" } // delai d'expiration du token
            )
            console.log(token);
            io.emit('my broadcast', `${token}`);
      }else{
        io.emit('my broadcast', "refuse");
      }

    }

  } catch (e) {
    // If parsing fails, do nothing and wait for more data to arrive
  }


});





 http.listen(3000, () => {
   console.log('listening on :3000');
 });

