'use strict';

const Boom = require('@hapi/boom');


const internals = {};


exports.getUserFromToken = function (request) {

    if (!request.auth ||
        !request.auth.isAuthenticated) {

        throw Boom.unauthorized('Missing authentication');
    }

    const credentials = request.auth.credentials;
    if (!credentials) {
        throw Boom.unauthorized('Missing credentials');
    }

    const user = credentials.user;
    if (!user) {
        throw Boom.forbidden('Application credentials cannot be used on a user endpoint');
    }

    return user;
};
