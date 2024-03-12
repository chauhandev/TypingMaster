const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dotenv = require("dotenv");
const authroute = require("./routes/auth.routes.js"); // Correct the path to auth.route
dotenv.config();

app.use(cors()); // Call cors() function
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use('/auth', authroute); // Use app.use instead of app.get for middleware routes

server.listen(PORT, () => { // Use server.listen for Socket.IO
  console.log(`listening on port ${PORT}`);
});
// io.on('connection', (socket) => {
    
//     console.log('a user connected');
//   });
  
// server.listen(3000, () => {
//     console.log('listening on *:3000');
//  });




 