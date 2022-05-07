const jwt = require('jsonwebtoken');

const SECRET_KEY = "My Secret Key";

function generateToken(payload){
    let token = jwt.sign(payload, SECRET_KEY)
    return token;
}

function verifyToken(token){
   let data = jwt.verify(token, SECRET_KEY);
   return data;
}


var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

module.exports = {
    generateToken,
    verifyToken
}