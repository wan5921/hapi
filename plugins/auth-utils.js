'use strict';

const Boom = require('@hapi/boom');

function getUserFromToken(authorization) {
    if (!authorization) {
        throw Boom.unauthorized('Missing authorization header');
    }

    const parts = authorization.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw Boom.unauthorized('Invalid authorization header format');
    }

    const token = parts[1];
    if (!token || token !== 'valid-token') {
        throw Boom.unauthorized('Invalid token');
    }

    return {
        isAuthenticated: true,
        token: token
    };
}

module.exports = {
    getUserFromToken
};
