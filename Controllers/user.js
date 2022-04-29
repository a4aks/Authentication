const userModel = require('../Models/user');
const parentModel = require('../Models/parents');
const { default: mongoose } = require('mongoose');
const emailService = require('../Notification/EmailService');
const JWTService = require('../CommonLib/JWTtoken');
const encryptDecrypt = require('../CommonLib/encryption-decryption');

async function getAllUser(req, res, next) {

    try {
        // const skip = req.query.skip || 0;
        const pageNo = req.query.pageNo;
        const pageSize = req.query.pageSize;
        const skip = ((pageNo - 1) * pageSize) || 0;  // undefined || 0
        const limit = req.query.limit || 10;

        const gender = req.query.gender; //29
        let searchObj = {};
        if (gender) {
            searchObj['gender'] = gender;
        }
        console.log(searchObj)
        let response = await userModel.find(searchObj).skip(skip).limit(limit);
        res.json(response);

    } catch (error) {
        res.status(500).json(error);
    }
}

async function createUser(req, res, next) {
    //fetch info from request body
    try {
        console.log("req.body", req.body);
        let userDetail = req.body;
        let response = await userModel.insertMany([userDetail]);
        let parentInfo = {
            empId: response[0]._id,
            firstName: req.body.parents.firstName,
            lastName: req.body.parents.lastName,
            age: req.body.parents.age,
            phoneNo: req.body.parents.phoneNo,

        }
        console.log(parentInfo)
        await parentModel.insertMany([parentInfo]);

        res.json(response);

    } catch (error) {
        res.json(error);
    }
}

async function getUserById(req, res, next) {
    let userId = req.params.userId;
    let response = await userModel.find({ _id: userId });
    res.json(response);
}

async function deleteUser(req, res, next) {
    let userId = req.params.userId;
    let response = await userModel.deleteOne({ _id: userId });
    res.json(response);
}

async function updateUser(req, res, next) {
    let userId = req.params.userId;
    let body = req.body;
    let response = await userModel.updateOne({ _id: userId }, { $set: body });
    res.json(response);
}

async function getParentsInfo(req, res, next) {
    console.log(req.params);
    let response = await parentModel.find({ empId: mongoose.Types.ObjectId(req.params.empId) }).populate('empId');
    res.json(response);
}
async function sendEmail(req, res, next) {
    console.log("in SendEmail function");

    const message = req.body.message;
    let response = await emailService.sendMail({

        from: '"Neeraj Gupta" <neeraj@unthinkable.co>', // sender address
        to: "neeraj.cbpgec@gmail.com", // list of receivers
        subject: "Hello World from Masai", // Subject line
        text: "Hello world", // plain text body
        html: `<b>${message}</b>`, // html body
    });

    console.log(response);
    res.send(true);
}

function saveImage(req, res, next) {
    console.log("Request file", req.file)
    res.json({
        "message": "Image saved",
        path: req.file.path
    })
}

async function signIn(req, res, next) {

    //Validate email and password
    const userDetail = await userModel.findOne({ email: req.body.email });
    console.log(userDetail, req.body.password)
    const isValidPassword = encryptDecrypt.decryptPassword(req.body.password, userDetail.password);

    if (isValidPassword) {
        let userData = {
            "email": req.body.email,
            "firstName": userDetail.firstName,
            "lastName": userDetail.lastName,
            "roleName": "ADMIN"

        }

        //Generate JWT token and send back to frontend
        let JWTtoken = JWTService.generateToken(userData);
        res.json({
            status: 'success',
            token: JWTtoken
        })
    } else {
        res.json({ message: "password is not valid" });
    }

}

async function signUp(req, res, next) {
    let userDetail = req.body;
    console.log(userDetail)
    const encryptPassword = encryptDecrypt.encryptPassword(userDetail.password);
    console.log(encryptPassword);
    userDetail.password = encryptPassword;
    console.log(userDetail);
    const response = await userModel.insertMany([userDetail]);
    res.json(response);
}


module.exports = {
    getAllUser,
    createUser,
    getUserById,
    deleteUser,
    updateUser,
    getParentsInfo,
    sendEmail,
    saveImage,
    signIn,
    signUp
}


