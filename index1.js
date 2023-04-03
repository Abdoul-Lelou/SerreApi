const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken")
const WebSocket = require('ws');


const cors = require('cors')

const routes = require('./routes/route');

const databaseLink = process.env.DATABASE_URL

mongoose.connect(databaseLink);
const database = mongoose.connection

const app = express();
const routerRfid = express.Router()
app.use(cors({origin: '*'}));

// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Origin", " http://localhost:4200");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//       next();
// });
app.use(express.json());
app.use(bodyParser.json());

app.use('/api', routes)


database.on('error', (error) => {
   console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

// app.use(cors({origin: '*'}));
app.use( cors({
   origin: ['https://americanairlines.com'],
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
 }))

const http = require('http').Server(app);

const io = require("socket.io")(http, {
   cors: {
      // origin: 'http://localhost:4200',
      // methods: ['GET', 'POST'],
      // credentials: true,
      // allowedHeaders: ["authorization"]
      origin: ['https://127.0.0.1'], credentials: true
   }
 });

 
 if (process.env.NODE_ENV === 'development') {
   io.engine.on('initial_headers', (headers, req) => {
       headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
       headers['Access-Control-Allow-Credentials'] = true;
   });

   io.engine.on('headers', (headers, req) => {
       headers['Access-Control-Allow-Origin'] = 'http://localhost:4200';
       headers['Access-Control-Allow-Credentials'] = true;
   });
}
 
app.listen(3000, () => {
   console.log(`Server Started at ${3000}`)
})

const SerialPort = require('serialport');

 
//  httpServer.listen(3000);

// const io = require('socket.io')(http, {
//    cors: {
//        origins: ['http://localhost:4200']
//    }
// });
// const app = require('express')();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http);
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });

// const wss = new WebSocket.Server({ port: 8080 });


let donne;
port.on('data', data => {
   // console.log(`test :${data.slice(0,1)}`);
   //  donne ="donneee: "+ data.slice(0,1)
    getConnectr(data.slice(0, 1));
   //  io.on('event', function firstListener() {
   //    console.log('Helloooo! first listener');
   //  });
   // console.log("test: " +donne);
   io.on('connection', (socket) => {
      console.log('a user connected');
      
      // Emit a message to all connected clients
      io.emit('message', 'A new user has joined the chat');
      
      // Handle disconnect event
      socket.on('disconnect', () => {
        console.log('user disconnected');
        
        // Emit a message to all connected clients
        io.emit('message', 'A user has left the chat');
      });
    });
});

io.on('connection', function(socket) {
    
   console.log('Node is listening to port');
   socket.on("active", (arg) => {
       console.log(arg); // world
       temoin = arg;
     });
   
});

 let getConnectr=(data)=>{
   if(data =='o'){
      token = jwt.sign(
         { userId: 'admin@gmail.com' }, // id et email de la personne connectée
           process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
         { expiresIn: "1h" } // delai d'expiration du token
       )
      console.log(token);
      // wss.on('connection', function connection(ws) {
      //    console.log('Client connected');
      //    ws.send('token');
      //  });

       
       
      // express.Router().post("", (req, res,)=>{
      //    return res.send({token:token});
      // })
   }else if(data =='n'){
      console.log('refuse');
      return;
   }
 }
 console.log(donne);


// var Serialport = require('serialport');
// //  const { set, ref } = require('firebase/database');
// //  const { databaserRealtime } = require('./firestoreConfig');
//  var Readline = Serialport.parsers.Readline;
 
//  console.log(Readline);
 
//  var port = new Serialport('/dev/ttyUSB0', {
//      baudRate: 9600
//  });
 
//  var parser = port.pipe(new Readline({ delimiter: '\r\n' }));
 
//  parser.on('readable', function() {
//      console.log('Connexion ouverte');
//  });