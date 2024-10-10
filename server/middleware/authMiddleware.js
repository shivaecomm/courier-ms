const jwt=require('jsonwebtoken')

const middleware=async(req,res,next)=>{
    try{
        const token=req.headers['Authorization'].split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decode)=>{
            if(err){
                return res.status(401).send({success:false,message:'Auth failed'})
            }else{
                req.body.userId=decode.id
                next();
            }
        })
    }catch(error){
        console.log(error.message)
        return res.status(401).send({success:false,message:'Auth failed'})
    }
}

module.exports=middleware;