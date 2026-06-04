'use strict';

const AuthUtils = require('../plugins/auth-utils');


const internals = {};


exports.routes = [
    {
        method: 'GET',
        path: '/profile',
        options: {
            auth: 'default'
        },
        handler: (request) => {

            const user = AuthUtils.getUserFromToken(request);
            return { id: user.id || user, name: user.name || user };
        }
    },
    {
        method: 'PUT',
        path: '/profile',
        options: {
            auth: 'default'
        },
        handler: (request) => {

            const user = AuthUtils.getUserFromToken(request);
            return { id: user.id || user, updated: true };
        }
    }
];
