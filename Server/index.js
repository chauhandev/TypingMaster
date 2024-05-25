const express = require('express');
const dotenv = require("dotenv");
const authroute = require("./routes/auth.routes.js"); 
const cors = require('cors');
const { connectToMongoDB } = require('./db/connectToMongoDB.js');
const {app ,server} = require('./socket/socket.js');
const path = require('path');

// const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(express.static(path.join(__dirname,"public")));
app.use('/api/auth', authroute);

app.get('/', function(req, res){
    res.sendFile(`${path.join(__dirname,'public/index.html')}`);
});
server.listen(PORT, () => { 
    connectToMongoDB();
    console.log(`listening on port ${PORT}`);
});





 