'use strict';

const Boom = require('@hapi/boom');


module.exports = ({ getUserFromToken }) => ({
    method: 'GET',
    path: '/api/user/profile',
    handler: async (request) => {

        const authorization = request.headers.authorization;
        if (!authorization) {
            throw Boom.unauthorized('Missing token');
        }

        const [scheme, token] = authorization.split(' ');
        if (scheme !== 'Bearer' || !token) {
            throw Boom.unauthorized('Invalid token');
        }

        let user;
        try {
            user = await getUserFromToken(token);
        }
        catch (err) {
            if (Boom.isBoom(err)) {
                throw err;
            }

            throw Boom.unauthorized('Invalid token');
        }

        if (!user) {
            throw Boom.notFound('User not found');
        }

        return { user };
    }
});
