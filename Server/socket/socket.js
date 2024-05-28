const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Define an async function to handle Socket.IO connection
const handleConnection = async (socket) => {
  console.log("Socket ID " + socket.id);
  const token = socket.handshake.auth.token;
  if (!token) {
    throw new Error('No token provided');
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); 
  if (!decodedToken.userID) {
    throw new Error('Invalid token');
  }
  const userID = decodedToken.userID;
  console.log("UserID: " + userID);
  try {
    // Find user by username
    let user = await User.findOneAndUpdate(
      { _id: userID },
      { $set: { socketID: socket.id } },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }
    io.emit('onlineUsers', (await getUsersWithSocketIDNotNull(socket.id)));
    socket.on('disconnect', ()=> handleDisconnect(socket,userID));   
    socket.on('challengeUser', (data) => handleChallengeUser(data, userID));   
    socket.on('challengeResponse', (data) => handleChallengeResponse(data, userID)); 
    socket.on('challengeResult', (data) => handleChallengeResult(data, userID)); 
    socket.on('currentlyTypingWord', (data) => handleCurrentWord(data, userID));   
  
  } catch (error) {
    console.error('Error handling connection:', error);
  }
};

// When a user connects, call the handleConnection function
io.on('connection', handleConnection);


async function getUsersWithSocketIDNotNull(socketID) {
  try {
    const users = await User.find({ socketID: { $ne: null } }).select('-password -_id');
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function handleDisconnect(socket , userID){
     console.log("User disconnected: " + socket.id);
    await User.findOneAndUpdate(
      { _id: userID },
      { $set: { socketID: null } }
    );
    io.emit('onlineUsers', (await getUsersWithSocketIDNotNull(socket.id)));
  }

async function handleChallengeUser(data, challenger) {
  try {
    console.log("opponent challenged: " + data);
    // Fetch sender details
    const challengerData = await User.findById(challenger).select('userName profilePic fullName socketID');
    if (!challengerData) {
      throw new Error('Sender not found');
    }
    // Emit the "UserChallenge" event with sender details
    io.to(data.socketID).emit('UserChallenge',  {opponent :challengerData , challengeConfig : data.challengeConfig} );
  } catch (error) {
    console.error('Error handling challengeUser:', error);
  }
}


async function handleChallengeResponse(data, guest){
  try {
    console.log("data :" + JSON.stringify(data));

    console.log("User" + data.challenger + " accepted");
    // Fetch sender details
    const opponent = await User.findById(guest).select('userName profilePic fullName socketID');
    if (!opponent) {
      throw new Error(' not found');
    }
    // Emit the "UserChallenge" event with sender details
    io.to(data.challenger).emit('ChallengeResponse', { opponent, response: data.response ,challengeConfig: data.challengeConfig});
  } catch (error) {
    console.error('Error handling challengeUser:', error);
  }
}

async function handleChallengeResult(data, user){
  try {
    console.log("data :" + JSON.stringify(data));
    const opponent = await User.findById(user).select('userName profilePic fullName socketID');
    if (!opponent) {
      throw new Error(' not found');
    }
    io.to(data.opponent).emit('OpponentScore', { opponent, result: data.result });
  } catch (error) {
    console.error('Error handling handleChallengeResult:', error);
  }
}

async function handleCurrentWord(data, user){
  try {
    console.log("data :" + JSON.stringify(data));
    const currentUser = await User.findById(user).select('userName profilePic fullName socketID');
    if (!currentUser) {
      throw new Error(' not found');
    }
    io.to(data.socketID).emit('OpponentCurrentlyTypingWord', {currentUser , currentIndex: data.currentIndex});
  } catch (error) {
    console.error('Error handling handleCurrentWord:', error);
  }
}


module.exports = { app, io, server };
