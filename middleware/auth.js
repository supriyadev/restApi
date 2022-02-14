const config=require('config');
const jwt =require('jsonwebtoken');

// next  
function auth(req,res,next){
    const token =req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied');
    try{
      const decode=  jwt.verify(token,config.get('jwttokenkey'));
      req.user=decode;
      next();   
    }
    catch(ex){
        res.status(400).send("Invalid token ");

    }
    
}
module.exports=auth;