const jwt = require('jsonwebtoken')

const secret = 'mysecretshhh'
const expiration = '2hr'

module.exports = {
    authMiddleware: function({req}){
        //allows token to be sent via req.body, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        //seperate 'bearer' from '<tokenvalue>'
        if(req.headers.authorization){
            token = token
            .split(' ')
            .pop()
            .trim()
        }
        //if there is no token return request object as is 
        if(!token){
            return req
        }
        try{ 
            //decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration})
            req.user = data
        }catch{
            console.log('invalid token')
        }

        //return updated request object
        return req
    },
    signToken: function({username, email, _id}){
        const payload = { username, email , _id}

        return jwt.sign({data: payload}, secret, { expiresIn: expiration})
    }
}