const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jwt-simple');
const moment = require('moment');

dotenv.config();

const GC_SCOPE = "https://www.googleapis.com/auth/calendar";
const GC_AUD = "https://www.googleapis.com/oauth2/v4/token";

function generateToken() {
    const now = moment();
    const exp = now.add(60, 'seconds').unix();
    const iat = now.unix();
    return jwt.encode({
        iss: process.env.GC_SERVICE_ACCOUNT_CLIENT_EMAIL,
        scope: GC_SCOPE,
        aud: GC_AUD,
        exp: exp,
        iat: iat
    }, 
    process.env.GC_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'), // use replace() to fix \n characters
    'RS256'
    );
}

const getCalToken = async (callback) => {
    console.log('Retrieving calendar token...');
    const jwtToken = generateToken();
    try {
        const response = await axios.post(GC_AUD, { grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwtToken });
        const accessToken = response.data.access_token;

        console.log('Calendar token retrieved!')
        return callback(null, accessToken);
    } catch (e) {
        console.log('Error retrieving calendar token: ', e);
        return callback(e);
    }   
};

const getCalEntries = async ({ accessToken, startDate, endDate }, callback) => {
    console.log('Retrieving calendar entries...');
    try {
        // Get All Users
        const response = await axios.get(
            `${process.env.GC_URI}/events?timeMax=${endDate}&timeMin=${startDate}&fields=items(attendees(displayName%2Cemail)%2Cend%2Fdate%2Cstart%2Fdate)&access_token={${accessToken}}`,
            { headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        console.log('Calendar entries retrieved!');
        return callback(null, response.data.items);
    } catch (e) {
        console.log('Error retrieving calendar entries: ', e);
        return callback(e);
    }
};

module.exports = { getCalToken, getCalEntries };