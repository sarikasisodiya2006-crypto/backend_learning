const jwt = require("jsonwebtoken");
const authMiddelware = (req,res,next)=>{
    try{
    const token =req.cookies.givenToken;
    if(!token){
        return res.status(401).send("Unauthorized");
    }
let secretKey = "MySecretKey";
    const decoded = jwt.verify(token,secretKey);
    if(!decoded){
        return res.status(401).send("Unauthorized");
    }
    console.log(decoded);
    req.userID = decoded.userID;

    next();}
    catch(err){
        console.log(err);
        res.status(500).send("SERVER ERROR!");
    }
}

module.exports = authMiddelware;