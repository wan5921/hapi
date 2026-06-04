'use strict';

const Boom = require('@hapi/boom');

const internals = {
    users: new Map([
        ['user-001', { id: 'user-001', email: 'alice@example.com', username: 'alice', createdAt: '2024-01-15T08:30:00.000Z' }],
        ['user-002', { id: 'user-002', email: 'bob@example.com', username: 'bob', createdAt: '2024-02-20T14:45:00.000Z' }]
    ])
};

exports.getProfile = {
    auth: 'jwt',
    handler: async (request, h) => {

        const userId = request.auth.credentials.id;

        const user = internals.users.get(userId);

        if (!user) {
            throw Boom.notFound('User not found');
        }

        return {
            email: user.email,
            username: user.username,
            createdAt: user.createdAt
        };
    }
};

exports.registerRoutes = (server) => {

    server.route({
        method: 'GET',
        path: '/users/profile',
        ...exports.getProfile
    });
};
