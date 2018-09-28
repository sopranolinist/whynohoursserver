const jwt = require('jwt-simple');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt-nodejs');

dotenv.config();

const validateSimple = (passcode) => {
    if (passcode && passcode === process.env.APP_PASSCODE) {
        const timestamp = new Date().getTime();
            // sub --> token subject
            // iat --> issued at timestamp
        const token = jwt.encode({ sub: process.env.APP_USERNAME, iat: timestamp }, process.env.JWT_SECRET);
        return token;
    }
    return false;
};

const validateToken = (decoded, request) => {
    console.log('decoded app token: ', decoded);
    if (decoded.sub === process.env.APP_USERNAME) {
        return { isValid: true };
    }
    return { isValid: false };
};

module.exports = { validateSimple, validateToken };


// export function authenticateUser(params) { 
//     if (params.passcode === process.env.APP_PASSCODE) {
//             const timestamp = new Date().getTime();
//             // sub --> token subject
//             // iat --> issued at timestamp
//             return jwt.encode({ sub: 'AUTHORIZED_USER', iat: timestamp }, process.env.JWT_SECRET);
//     }    
//     return null;
// }

// export function tokenForUser() {

// }

// export function signin(req, res) {
//     // At this point User has already had their email & password auth'd
//     // We just need to give them a token
//     res.send({ token: tokenForUser(req.user) });
// }

