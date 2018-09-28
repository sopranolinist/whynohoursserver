const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getTimeEntries = async ({ userId, startDate, endDate }, callback) => {
    console.log('Retrieving time entries...');
    try {
        const response = await axios.get(
            `${process.env.HARVEST_SERVER_URI}/time_entries?user_id=${userId}&from=${startDate}&to=${endDate}`, 
            {
                headers: {
                    'Authorization': `Bearer ${process.env.HARVEST_ACCESS_TOKEN}`,
                    'Harvest-Account-ID': `${process.env.HARVEST_ACCOUNT_ID}`,
                    'User-Agent': `${process.env.HARVEST_USER_AGENT}`,
                    'Origin': 'null'
                }
            }
        ); 
        console.log('Time entries retrieved!');
        return callback(null, response.data.time_entries);
    } catch (e) {
        console.log('Error retrieving time entries: ', e);
        return callback(e);
    }
};

module.exports = { getTimeEntries };