const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const cors = require('cors')
const routes = require('./routes/route');
const serreRoute = require('./routes/serreRouter')
const arrosageRoute = require('./routes/arrosageRouter')

require('dotenv').config();

const databaseLink = process.env.DATABASE_URL;
mongoose.connect(databaseLink);
const database = mongoose.connection;
const app = express();

app.use(cors({ origin: '*' }));
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

// module.exports = database;


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});



// try {
//   const portSerial = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 }) || null;
//   const parser = portSerial.pipe(new ReadlineParser({ delimiter: '\r\n' }))
//   //ECOUTER LES EVENNEMENTS DEPUIS LE FRONT
//   portSerial.on('open', () => {
//     io.on('connection', (socket) => {

//       socket.on('isOn', (msg) => {
//         console.log('lampe: ' + msg);
//         portSerial.write("1")
//       });

//       socket.on('isOff', (msg) => {
//         console.log('lampe: ' + msg);
//         portSerial.write("0")
//       });

//       socket.on('isWater', (msg) => {
//         console.log('water: ' + msg);
//         portSerial.write("2")
//       });

//       socket.on('noWater', (msg) => {
//         console.log('water: ' + msg);
//         portSerial.write("3")
//       });

//       socket.on('noFan', (msg) => {
//         console.log('fan: ' + msg);
//         portSerial.write("4")
//       });

//       socket.on('isFan', (msg) => {
//         console.log('fan: ' + msg);
//         portSerial.write("5")
//       });

//       socket.on('openDoor', (msg) => {
//         console.log('door: ' + msg);
//         portSerial.write("6")
//       });

//       socket.on('closeDoor', (msg) => {
//         console.log('door: ' + msg);
//         portSerial.write("7")
//       });
//     });
//   });

//   //ECOUTER LES EVENNEMENTS DEPUIS ESP32,ARDUINO,MEGA...

//   parser.on('data', (data) => {

//     console.log("en attente....");

//     try {
//       let dataStr = data.toString();
//       let matin = "", soir = "", dureMatin = "", dureSoir = "";


//       let jsonData = JSON.parse(dataStr)

//       // If parsing succeeds, process the JSON data
//       console.log('Received JSON:', jsonData);

//       if (jsonData) {

//         io.emit('temp', `${jsonData.temp}`);
//         io.emit('hum', `${jsonData.hum}`);
//         io.emit('lum', `${jsonData.lum}`);
//         io.emit('sol', `${jsonData.sol}`);
//         io.emit('buzzer', `${jsonData.buzzer}`);
//         io.emit('toit', `${jsonData.toit}`);
//         io.emit('door', `${jsonData.door}`);

//         let tempEtHum = {
//           'temp': jsonData.temp,
//           'hum': jsonData.hum,
//           'dateInsertion': new Date(),
//           'lum': jsonData.lum,
//           'sol': jsonData.sol,
//         };
//         //Connexion a mongodb et insertion Temperature et humidite
//         //  serre.save(tempEtHum)

//         const datHeure = new Date();
//         const min = datHeure.getMinutes();
//         const heur = datHeure.getHours(); //heure
//         const sec = datHeure.getSeconds();

//         const arrosageCollection = database.collection('arrosages');

//         // const collection = client.db('<database>').collection('<collection>');

//         arrosageCollection.findOne({}, function (err, result) {
//           if (err) {
//             console.log('Error finding document:', err);
//             return;
//           }
//           matin = result.matin;
//           soir = result.soir;
//           dureMatin = result.dureMatin
//           dureSoir = result.dureSoir
//           console.log(sec, ": ", dureSoir);
//           console.log("seconde est de :", sec == dureSoir);
//         })


//         if ((heur == matin && min == 00 && sec == 00)) {
//           portSerial.write("2")
//           console.log("arroser");
//         } else if ((heur == matin && min == 00 && sec == dureMatin)) {
//           portSerial.write("3");
//           console.log("arreter");
//         } else if ((heur == soir && min == 00 && sec == 00)) {
//           console.log("arroser");
//           portSerial.write("2")
//         } else if (heur == soir && min == 00 && sec == dureSoir) {
//           portSerial.write("3");
//           console.log("arreter");
//         }

//         if ((heur == 08 && min == 00 && sec == 00) || (heur == 19 && min == 00 && sec == 00)) {

//           setTimeout(() => {
//             const collection = database.collection('serres');

//             collection.insertOne(tempEtHum, function (err) {
//               if (err) throw err;
//               console.log("Data inserted successfully!");
//             });
//           }, 1000);
//         }


//         if (jsonData.rfid == true) {
//           token = jwt.sign(
//             { userId: 'admin@gmail.com' }, // id et email de la personne connectée
//             process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
//             { expiresIn: "1h" } // delai d'expiration du token
//           )
//           console.log(token);
//           io.emit('my broadcast', `${token}`);
//         } else {
//           io.emit('my broadcast', "refuse");
//         }

//       }

//     } catch (error) {
//       // throw error
//     }
//   })
// } catch (error) {
//   console.log('brancher une carte');
// }

//ECOUTE DU SERVER SUR LE PORT 3000
http.listen(3000, () => {
  console.log('listening on :3000');
});

