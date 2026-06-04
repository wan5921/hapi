'use strict';

function getUserFromToken(token) {
    if (!token) {
        return null;
    }
    // Simple mock implementation
    if (token === 'valid-token-user1') {
        return { id: 1, username: 'user1', role: 'user' };
    }
    if (token === 'valid-token-admin') {
        return { id: 2, username: 'admin', role: 'admin' };
    }
    return null;
}

module.exports = {
    getUserFromToken
};
