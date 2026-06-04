const Hapi = require('@hapi/hapi');

// 模拟的外部函数，用于从 token 获取用户
const getUserFromToken = async (token) => {
    // 真实场景下这里会有数据库调用
    return null;
};

const route = {
    method: 'GET',
    path: '/api/user/profile',
    handler: async (request, h) => {
        const token = request.headers.authorization;
        
        if (!token) {
            return h.response({ message: 'Missing token' }).code(401);
        }

        try {
            const user = await module.exports.getUserFromToken(token);
            
            if (user === null) {
                return h.response({ message: 'User not found' }).code(404);
            }
            
            return h.response({ user }).code(200);
        } catch (err) {
            return h.response({ message: 'Invalid token' }).code(401);
        }
    }
};

module.exports = {
    route,
    getUserFromToken
};