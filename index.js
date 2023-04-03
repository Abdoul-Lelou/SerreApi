const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require("jsonwebtoken")

const routes = require('./routes/route');

// const databaseLink = process.env.DATABASE_URL
// process.setMaxListeners(20);
// mongoose.connect(databaseLink);
// const database = mongoose.connection
app.use(cors({origin: '*'}));
// app.use(app.json());
app.use(bodyParser.json());

app.use('/api', routes)


// database.on('error', (error) => {
//    console.log(error)
// })

// database.once('connected', () => {
//     console.log('Database Connected');
// })



const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});



io.on('connection', (socket) => {
  
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('my message', (msg) => {
    console.log('message: ' + msg);
  });

  // socket.on('my message', (msg) => {
  //   io.emit('my broadcast', `server: ${msg}`);
  // });
});


const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });

port.on('data', data => {

  let status = ""+data;
  console.log(status == "1");

  
  if (status == "1") {
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

  
  
});

http.listen(3000, () => {
  console.log('listening on :3000');
});