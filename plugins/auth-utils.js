'use strict';

exports.getUserFromToken = function (authorization, options = {}) {

    if (!authorization) {
        return { isMissing: true };
    }

    const parts = authorization.split(/\s+/);
    if (parts.length !== 2) {
        return { isMalformed: true, parts };
    }

    if (options.scheme &&
        parts[0] &&
        parts[0].toLowerCase() !== options.scheme.toLowerCase()) {

        return { isInvalidScheme: true, parts };
    }

    const token = parts[1];
    const user = options.parseToken ? options.parseToken(token) : options.users?.[token];

    return { token, user, parts };
};
