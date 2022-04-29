const http = require('http');
const app = require('./Routes/user');
const connectToDB = require('./DBConnection/mongoDB');
const PORT = process.env.PORT || 9008;

http.createServer(app).listen(PORT, () => {
    new connectToDB();

    console.log(`Server is running on port no ${PORT}`)
});

