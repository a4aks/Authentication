const userModel = require('../Models/user');
const parentModel = require('../Models/parents');
const { default: mongoose } = require('mongoose');
const emailService = require('../Notification/EmailService');
const JWTService = require('../CommonLib/JWToken');


async function getAllUser(req, res, next) {
    try {
        const pageNo = req.query.pageNo;
        const pageSize = req.query.pageSize;

        const skip = ((pageNo-1) * pageSize)|| 0;

        const limit = req.query.limit || 10;
        console.log(`limit & skip: ${limit} ${skip}`);
        const gender = req.query.gender;
        let searchObj = {}
        if(gender){
            searchObj['gender'] = gender;
        }
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

async function sendEmail(req,res,next){
     const message = req.body.message;
     let response = await emailService.sendMail({
        from: '"Ashish Sinha" <ashish@unthinkable.co>', // sender address
        to: "ashish.cbpgec@gmail.com", // list of receivers
        subject: "Hello World from Masai", // Subject line
        text: "Hello world", // plain text body
        html: `<b>${message}</b>`, // html body
     })
     console.log(response);
     res.send(true);
}
function saveImage(req,res,next){
   console.log("Request FIle", req.file);
    res.json({
        "message": "Images Saved",
        path: req.file.path
    })
}

async function signIn(req,res,next){
     console.log(req.body);
     let userDetail = {
         "email": req.body.email,
         "firstName":"Ashish",
         "lastName":"Sinha",
         "role":"Admin"
     }
     // generate JWToken and send back to frontend.
     let JWToken = JWTService.generateToken();
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
    signIn
}


