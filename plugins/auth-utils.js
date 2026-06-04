'use strict';

const Hoek = require('@hapi/hoek');


const internals = {};


internals.extractToken = function (request) {

    const header = request.headers.authorization;
    if (!header) {
        return null;
    }

    const parts = header.split(/\s+/);
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return null;
    }

    return parts[1];
};


internals.decodeTokenPayload = function (token) {

    const segments = token.split('.');
    if (segments.length !== 3) {
        return null;
    }

    try {
        const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = Buffer.from(base64, 'base64').toString('utf8');
        return JSON.parse(payload);
    }
    catch {
        return null;
    }
};


exports.getUserFromToken = function (request) {

    Hoek.assert(request && typeof request === 'object', 'Request object is required');

    const token = internals.extractToken(request);
    if (!token) {
        return null;
    }

    const payload = internals.decodeTokenPayload(token);
    if (!payload) {
        return null;
    }

    return payload.user ?? payload.sub ?? payload;
};