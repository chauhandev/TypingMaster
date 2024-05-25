const bcrypt = require('bcryptjs');
const generateWebTokenAndSetCookie = require('../utils/generateToken');

const User = require('../models/user.model.js');

const signupUser = async (req, res) => {
    try{
       // res.send("singupUser");
        console.log("signupUser");
        const {fullName, userName , password ,confirmPassword ,gender} = req.body;
    
        if(password != confirmPassword){
            return res.status(400).json({error:"Password and Confirm Password did not match."});
        }
    
        const user  = await User.findOne({userName});
        if(user){
            return res.status(400).json({error:"User does not exist"});
        }
    
        //hash password
        const salt  = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
    
        const newUser = new User({
            fullName: fullName,
            userName: userName,
            password: hashPassword,
            gender: gender,
            profilePic : gender === 'male' ? boyProfilePic : girlProfilePic
        });
        if(newUser){
            generateWebTokenAndSetCookie(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                userName : newUser.userName,
                profilePic : newUser.profilePic
            });
        }
        else{
            res.status(400).json({error :"Invalid user data."})
        }
     
    }
    catch(err){
       res.status(500).json({error:"Internal Server Error"});
    }
};

const loginUser = async (req, res) => {
    try{
        console.log("loginUser");
        const { userName , password } = req.body;

        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid Username or Password"});
        }
        
        res.status(201).json({
            _id : user._id,
            fullName : user.fullName,
            userName : user.userName,
            profilePic : user.profilePic,
            token: generateWebTokenAndSetCookie(user._id,res)
        }); 
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
   
};


const logOutUser = (req, res) => {
    try{
        res.cookie("token","",{maxAge:0});
        res.status(200).json({message :"Logged Out successfully"});
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});  
    }
};

module.exports = {
    loginUser,
    signupUser,
    logOutUser
};