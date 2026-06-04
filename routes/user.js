'use strict';

const { getUserFromToken } = require('../plugins/auth-utils');

function getUserProfile(req, res) {
    const token = req.headers && req.headers.authorization;
    const user = getUserFromToken(token);
    
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return res.status(200).json({ profile: user });
}

module.exports = {
    getUserProfile
};
