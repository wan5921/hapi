'use strict';

const Boom = require('@hapi/boom');

const internals = {};

internals.getUserFromToken = async function (token) {

    // 这里是模拟从数据库或外部服务获取用户信息的函数
    // 在实际项目中，这里会有真实的数据库调用
    if (token === 'valid-token-with-user') {
        return {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
        };
    }

    if (token === 'valid-token-without-user') {
        return null;
    }

    return null;
};

// 确保使用同一个函数引用
exports.getUserFromToken = internals.getUserFromToken;

exports.register = async function (server) {

    server.route({
        method: 'GET',
        path: '/api/user/profile',
        handler: async function (request, h) {

            const token = request.headers.authorization;

            if (!token) {
                throw Boom.unauthorized('Missing authentication token');
            }

            const user = await exports.getUserFromToken(token);

            if (!user) {
                throw Boom.notFound('User not found');
            }

            return { user };
        }
    });
};
