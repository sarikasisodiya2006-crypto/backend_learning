const authorization =(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return res.status(403).json({message:"you are not authoriize to acces this data!"})
        }
        next();
    }

}

module.exports = authorization;