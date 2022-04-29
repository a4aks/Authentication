const JWTService = require('../CommonLib/JWTtoken');

function isValidToken(req, res, next) {
    try {
        const token = req.headers.token;
        const response = JWTService.verifyToken(token);
        next();
    } catch (error) {
        res.json(error);
    }
}

function isSuperAdmin(req, res, next) {
    try {
        const token = req.headers.token;
        const response = JWTService.verifyToken(token);

        if (response.roleName !== 'SUPERADMIN') {
            res.json({ message: "User is not super admin.Only super admin can send email" });
        }

        next();
    } catch (error) {
        res.json(error);
    }
}



module.exports = {
    isValidToken,
    isSuperAdmin
}
