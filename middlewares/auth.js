const jwt=require('jsonwebtoken')
 var {promisify} =require('util')

//authentication
async function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'you have not access , please login first' })
    }

    try{
        var decoded = await promisify(jwt.verify)(req.headers.authorization,process.env.SECRET)
        req.id=decoded.id
    
    }catch(err){

       return res.status(401).json({message:'you are not authenticated'})
    }
 
    next()
}

module.exports = auth