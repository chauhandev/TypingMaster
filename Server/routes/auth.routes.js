const express = require('express');
const { loginUser, logOutUser ,signupUser} = require('../controllers/auth.controller');
const router = express.Router();

router.post('/login', loginUser);

router.post('/logout', logOutUser);

router.post('/signup', signupUser);


module.exports = router;

