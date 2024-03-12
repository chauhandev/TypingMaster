const loginUser = (req, res) => {
    res.send("loginUser");
    console.log("loginUser");
};

const signupUser = (req, res) => {
    res.send("singupUser");
    console.log("signupUser");
};

const logOutUser = (req, res) => {
    res.send("logOutUser");
    console.log("logOutUser");
};

module.exports = {
    loginUser,
    signupUser,
    logOutUser
};