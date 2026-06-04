'use strict';

const Boom = require('@hapi/boom');
const db = require('./example-models-db');

module.exports = [
    {
        method: 'GET',
        path: '/user',
        handler: async (request, h) => {
            const userId = request.auth.credentials.userId;
            const user = await db.getUserById(userId);

            if (!user) {
                throw Boom.notFound('User not found');
            }

            return {
                email: user.email,
                username: user.username,
                createdAt: user.createdAt
            };
        },
        options: {
            auth: 'jwt',
            description: 'Get current user information',
            tags: ['api', 'user']
        }
    }
];
