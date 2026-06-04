'use strict';

const Hapi = require('@hapi/hapi');
const HapiAuthJwt2 = require('hapi-auth-jwt2');
const userRoutes = require('./example-routes-user');
const db = require('./example-models-db');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(HapiAuthJwt2);

    server.auth.strategy('jwt', 'jwt', {
        key: 'your-secret-key',
        validate: async (decoded) => {
            const user = await db.getUserById(decoded.userId);
            if (user) {
                return { isValid: true, credentials: { userId: decoded.userId } };
            }
            return { isValid: false };
        },
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    server.route(userRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
