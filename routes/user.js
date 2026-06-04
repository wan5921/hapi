'use strict';

const UserModule = exports;

exports.getUserFromToken = async (token) => {

    const validToken = 'Bearer valid-token-123';
    if (token === validToken) {
        return { id: 1, name: 'John Doe', email: 'john@example.com' };
    }

    return null;
};

exports.register = async (server, options) => {

    server.route({
        method: 'GET',
        path: '/api/user/profile',
        options: {
            auth: false,
            handler: async (request, h) => {

                const token = request.headers.authorization;

                if (!token) {
                    return h.response({ message: 'Missing authentication token' }).code(401);
                }

                const user = await UserModule.getUserFromToken(token);

                if (!user) {
                    return h.response({ message: 'User not found' }).code(404);
                }

                return h.response({ user }).code(200);
            }
        }
    });
};
