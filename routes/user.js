// routes/user.js
const getUserFromToken = async (token) => {
    // 模拟真实的数据库调用
    return null;
};

const route = {
    method: 'GET',
    path: '/api/user/profile',
    handler: async (request, h) => {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return h.response({ message: '未携带 token' }).code(401);
        }

        const token = authHeader.replace('Bearer ', '');
        
        let user;
        try {
            // 注意这里通过 module.exports 调用以便 sinon 能够 stub
            user = await module.exports.getUserFromToken(token);
        } catch (err) {
            return h.response({ message: 'token 无效' }).code(401);
        }

        if (user === null || user === undefined) {
            return h.response({ message: '用户不存在' }).code(404);
        }

        return h.response({ user }).code(200);
    }
};

module.exports = {
    route,
    getUserFromToken
};
