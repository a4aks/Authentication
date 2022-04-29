const jwt = require('jsonwebtoken');

const SECRET_KEY = "MY_secret_key";

function generateToken(payload) {

    let token = jwt.sign(payload, SECRET_KEY);
    return token;
}

function verifyToken(token) {
    let data = jwt.verify(token, SECRET_KEY);
    return data;
}

module.exports = {
    generateToken,
    verifyToken
}
