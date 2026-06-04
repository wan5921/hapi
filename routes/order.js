'use strict';

const { getUserFromToken } = require('../plugins/auth-utils');

function getOrders(req, res) {
    const token = req.headers && req.headers.authorization;
    const user = getUserFromToken(token);
    
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return res.status(200).json({ orders: [{ id: 101, item: 'Book' }] });
}

module.exports = {
    getOrders
};
