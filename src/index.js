'use strict';

const Hapi = require('hapi');
const jwt = require('jwt-simple');
const dotenv = require('dotenv');
const { validateSimple, validateToken } = require('./controllers/auth');
const { getUsers } = require('./controllers/users');
const { getTimeEntries } = require('./controllers/timeEntries');
const { getCalToken, getCalEntries } = require('./controllers/calendar');

dotenv.config();

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {cors: true}
});

const init = async () => {

    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET,
        validate: validateToken
    });

    server.route({
        method: 'POST',
        path: '/signin',
        config: {
            auth: false,
            handler: function (request, h) {
                console.log('request payload: ', request.payload);
                const token = validateSimple(request.payload.passcode);

                if (!token) {
                    return h.response().code(401);
                }
                return { token: token };
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        config: { auth: 'jwt' },
        handler: function (request, h) {
            return getUsers((err, data) => {
                if (err) {
                    return h.response().code(500);
                }
                return data;
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/timeEntries',
        config: { auth: 'jwt' },
        handler: function (request, h) {
            const params = request.query;
            if (Object.keys(params).length !== 0 && params.userId && params.startDate && params.endDate) {                
                return getTimeEntries(params, (err, data) => {
                    if (err) {
                        return h.response().code(500);
                    }
                    return data;
                });
            }
            return h.response().code(400); // no params or missing params = malformed request
        }
    });

    server.route({
        method: 'GET',
        path: '/calToken',
        config: { auth: 'jwt' },
        handler: function (request, h) {
            return getCalToken((err, data) => {
                if (err) {
                    return h.response().code(500);
                }
                return data;
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/calEntries',
        config: { auth: 'jwt' },
        handler: function (request, h) {
            const params = request.query;
            if (Object.keys(params).length !== 0 && params.accessToken && params.startDate && params.endDate) {                
                return getCalEntries(params, (err, data) => {
                    if (err) {
                        return h.response().code(500);
                    }
                    return data;
                });
            }
            return h.response().code(400); // no params or missing params = malformed request
        }
    });
    
    server.route({
        method: 'GET', 
        path: '/', 
        config: { auth: 'jwt' },
        handler: function(request, h) {
            return h.response({text: 'You used a Token!'}).header("Authorization", request.headers.authorization);
        }
    });


    process.on('unhandledRejection', (err) => {

        console.log(err);
        process.exit(1);
    });

    await server.start();

    console.log(`Server running at: ${server.info.uri}`);
};

init();


// server.route({
//     method: 'GET',
//     path: '/{name}',
//     handler: (request, h) => {

//         return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
//     }
// });

// server.route({
//     method: 'POST',
//     path: '/authenticate',
//     handler: (request, h) => {
//         if (request.params && request.params.passcode && request.params.passcode === process.env.APP_PASSCODE) {
//             const timestamp = new Date().getTime();
//             // sub --> token subject
//             // iat --> issued at timestamp
//             return jwt.encode({ sub: 'AUTHORIZED_USER', iat: timestamp }, process.env.JWT_SECRET);
//     }    
//     }
// });
