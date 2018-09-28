const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getUsers = async (callback) => {
    console.log('Retrieving users...');
    try {
        // Get All Users
        const response = await axios.get(
            `${process.env.HARVEST_SERVER_URI}/users`, 
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HARVEST_ACCESS_TOKEN}`,
                    'Harvest-Account-ID': `${process.env.HARVEST_ACCOUNT_ID}`,
                    'User-Agent': `${process.env.HARVEST_USER_AGENT}`
                }
            }
        ); 
        console.log('Users retrieved!');
        return callback(null, response.data.users);
    } catch (e) {
        console.log('Error retrieving users: ', e);
        return callback(e);
    }
};

module.exports = { getUsers };