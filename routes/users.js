'use strict';

const Boom = require('@hapi/boom');
const { getUserFromToken } = require('../plugins/auth-utils');

const users = {
    'john': { id: 1, name: 'John Doe', email: 'john@example.com' },
    'jane': { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
};

exports.register = function (server) {
    server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: async (request, h) => {
            getUserFromToken(request.headers.authorization);

            const user = users[request.params.id];
            if (!user) {
                throw Boom.notFound('User not found');
            }

            return user;
        }
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
            getUserFromToken(request.headers.authorization);

            return Object.values(users);
        }
    });
};
