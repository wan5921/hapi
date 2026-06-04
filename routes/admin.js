'use strict';

const Boom = require('@hapi/boom');

const AuthUtils = require('../plugins/auth-utils');


const internals = {};


exports.routes = [
    {
        method: 'GET',
        path: '/admin/users',
        options: {
            auth: 'default'
        },
        handler: (request) => {

            const user = AuthUtils.getUserFromToken(request);

            const credentials = request.auth.credentials;
            const scope = credentials.scope;
            if (!scope || (Array.isArray(scope) && !scope.includes('admin')) || scope !== 'admin') {
                throw Boom.forbidden('Insufficient scope');
            }

            return { users: [], requestedBy: user.id || user };
        }
    },
    {
        method: 'DELETE',
        path: '/admin/users/{userId}',
        options: {
            auth: 'default'
        },
        handler: (request) => {

            const user = AuthUtils.getUserFromToken(request);

            const credentials = request.auth.credentials;
            const scope = credentials.scope;
            if (!scope || (Array.isArray(scope) && !scope.includes('admin')) || scope !== 'admin') {
                throw Boom.forbidden('Insufficient scope');
            }

            return { deleted: request.params.userId, deletedBy: user.id || user };
        }
    }
];
