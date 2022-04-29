const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "3e4b3cf3338b3c",
        pass: "4f84e78a90f8b3"
    }
});

module.exports = transport;
