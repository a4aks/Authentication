
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userController = require('../Controllers/user');
const userModel = require('../Models/user');
const { engine } = require('express-handlebars');
const multer = require('multer');
const middleware = require('../Middleware/middleware');
const passport = require('../Authentication/googleLogin');
const JWTService = require('../CommonLib/JWTtoken');
const encryptDecrypt = require('../CommonLib/encryption-decryption');
const user = require('../Models/user');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(__dirname);
        cb(null, `${__dirname}/public`)
    },
    filename: function (req, file, cb) {
        console.log(file);
        const ext = file.mimetype.split("/")[1];
        //jpeg
        if (ext != 'jpeg') { cb(new Error("format not accept")) }
        cb(null, `/public-${file.fieldname}-${Date.now()}.${ext}`);
    }
})

const upload = multer({
    storage: diskStorage
});

app.use(bodyParser.json([]));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(passport.initialize());

app.get('/',userController.dashboard);
app.post('/user', userController.createUser);
app.get('/user', userController.getAllUser)
app.get('/user/:userId', userController.getUserById);
app.put('/user/:userId', userController.updateUser);
app.delete('/user/:userId', userController.deleteUser);
app.get('/parentInfo/:empId', middleware.isValidToken, userController.getParentsInfo);

app.post('/sendEmail', middleware.isSuperAdmin, userController.sendEmail);

app.post('/saveImage', upload.single('file'), userController.saveImage)


app.post('/signUp', userController.signUp);
app.post('/signIn', userController.signIn);

app.get('/failed', (req, res) => {
    res.send("Some error occured while login to google");
});

app.get('/success', (req, res) => {
    console.log(req.user);
    res.send('Successfully loggedIn to google');
})

app.get('/google', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}
));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    async function (req, res) {
        //check if user exist in our system
        //if exist generate token and send back to frontend
        //  else  register user and then generate token and send back to frontend

        let email = req.user.email;
        //check for email
        const userDetail = await userModel.findOne({ email });
        if (userDetail) {
            //create token and send back to FE
            console.log("Hi there", userDetail);
            let obj = {
                firstName: userDetail.firstName,
                lastName: userDetail.lastName,
                age: userDetail.age,
                phoneNo: userDetail.phoneNo,
                email: userDetail.email,
                gender: userDetail.gender

            }
            let JWTtoken = JWTService.generateToken(obj);
            res.status(200).json(
                {
                    message: "Success login",
                    token: JWTtoken
                });
        } else {
            let lastUser = await userModel.find({}).sort({ id: -1 }).limit(1);
            let encryptedPassword = encryptDecrypt.encryptPassword("kjdslkjadkj@23144$$");
            let userDetailObj = {
                firstName: req.user.given_name,
                lastName: req.user.family_name,
                age: -1,
                phoneNo: -1,
                email,
                gender: "NA",
                password: encryptedPassword,
                id: lastUser[0].id + 1
            }
            let response = await userModel.insertMany([userDetailObj]);
            delete userDetailObj.password;
            let JWTtoken = JWTService.generateToken(userDetailObj);
            res.status(200).json(
                {
                    message: "Registeration Success",
                    token: JWTtoken
                });

        }

    })





module.exports = app;