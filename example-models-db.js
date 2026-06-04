'use strict';

const users = {
    '1': {
        id: '1',
        email: 'user1@example.com',
        username: 'user1',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        createdAt: new Date('2024-01-01T00:00:00Z')
    },
    '2': {
        id: '2',
        email: 'user2@example.com',
        username: 'user2',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        createdAt: new Date('2024-02-01T00:00:00Z')
    }
};

const getUserById = async (userId) => {
    return users[userId] || null;
};

const getUserByEmail = async (email) => {
    return Object.values(users).find(user => user.email === email) || null;
};

module.exports = {
    getUserById,
    getUserByEmail
};
