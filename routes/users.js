'use strict';

const Boom = require('@hapi/boom');
const { getUserFromToken } = require('../plugins/auth-utils');


const internals = {};


exports.routes = [
    {
        method: 'GET',
        path: '/users/me',
        handler: (request, h) => {

            const user = getUserFromToken(request);
            if (!user) {
                throw Boom.unauthorized('Missing or invalid token');
            }

            return h.response({ id: user.id, name: user.name, role: user.role });
        }
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: (request, h) => {

            const user = getUserFromToken(request);
            if (!user) {
                throw Boom.unauthorized('Missing or invalid token');
            }

            return h.response({ requestedId: request.params.id, accessedBy: user.name });
        }
    }
];