'use strict';

const Boom = require('@hapi/boom');

const internals = {
    users: new Map([
        ['1', {
            email: 'ada@example.com',
            username: 'ada',
            createdAt: '2024-01-15T08:30:00.000Z'
        }],
        ['2', {
            email: 'grace@example.com',
            username: 'grace',
            createdAt: '2024-05-10T14:45:00.000Z'
        }]
    ]),
    getUserId(credentials) {

        if (!credentials) {
            return null;
        }

        return credentials.id || credentials.userId || credentials.user?.id || null;
    },
    async findUser(server, userId) {

        const store = server.app.userStore;

        if (store?.getById) {
            return await store.getById(userId);
        }

        if (store instanceof Map) {
            return store.get(userId) || null;
        }

        if (store && typeof store === 'object') {
            return store[userId] || null;
        }

        return internals.users.get(userId) || null;
    },
    formatUser(user) {

        return {
            email: user.email,
            username: user.username,
            createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt
        };
    }
};

module.exports = {
    name: 'user-routes',
    register: async (server) => {

        server.route({
            method: 'GET',
            path: '/users/me',
            options: {
                auth: {
                    mode: 'required'
                },
                handler: async (request) => {

                    const userId = internals.getUserId(request.auth.credentials);
                    if (!userId) {
                        throw Boom.unauthorized('Missing user id in auth credentials');
                    }

                    const user = await internals.findUser(request.server, userId);
                    if (!user) {
                        throw Boom.notFound('User not found');
                    }

                    return internals.formatUser(user);
                }
            }
        });
    }
};
