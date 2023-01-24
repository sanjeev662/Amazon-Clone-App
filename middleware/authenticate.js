const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const secretKey = process.env.KEY

const authenticate = async(req,res,next)=>{
    try {
        const token = req.cookies.Amazonweb;
        
        const verifyToken = jwt.verify(token,secretKey);
     
        const rootUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
       

        if(!rootUser)
        // {return res.status(422).json({ error: "User Not Found" });}
        { throw new Error("User Not Found") };
        
        req.token = token; 
        req.rootUser = rootUser;   
        req.userID = rootUser._id;   
    
        next();  


    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized:No token provided");
        
    }
};

module.exports = authenticate;