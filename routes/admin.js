'use strict';

const Boom = require('@hapi/boom');
const { getUserFromToken } = require('../plugins/auth-utils');


const internals = {};


exports.routes = [
    {
        method: 'GET',
        path: '/admin/dashboard',
        handler: (request, h) => {

            const user = getUserFromToken(request);
            if (!user) {
                throw Boom.unauthorized('Missing or invalid token');
            }

            if (user.role !== 'admin') {
                throw Boom.forbidden('Admin access required');
            }

            return h.response({ message: 'Welcome to admin dashboard', user: user.name });
        }
    },
    {
        method: 'POST',
        path: '/admin/config',
        handler: (request, h) => {

            const user = getUserFromToken(request);
            if (!user) {
                throw Boom.unauthorized('Missing or invalid token');
            }

            if (user.role !== 'admin') {
                throw Boom.forbidden('Admin access required');
            }

            return h.response({ updated: true, by: user.name });
        }
    }
];