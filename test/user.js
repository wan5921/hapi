'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const UserRoutes = require('../routes/user');

const internals = {};

const { describe, it, beforeEach, afterEach } = exports.lab = Lab.script();
const expect = Code.expect;

describe('User Profile API', () => {

    let server;
    let getUserFromTokenStub;

    beforeEach(async () => {

        // 创建 getUserFromToken 的 sinon stub
        getUserFromTokenStub = Sinon.stub(UserRoutes, 'getUserFromToken');

        server = Hapi.server();
        await UserRoutes.register(server);
    });

    afterEach(() => {

        // 恢复原始函数
        getUserFromTokenStub.restore();
    });

    it('returns 401 when no token is provided', async () => {

        const res = await server.inject('/api/user/profile');
        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Missing authentication token');
        expect(getUserFromTokenStub.called).to.be.false();
    });

    it('returns 401 when token is invalid', async () => {

        // 模拟 token 无效的情况
        getUserFromTokenStub.withArgs('invalid-token').resolves(null);

        const res = await server.inject({
            url: '/api/user/profile',
            headers: { authorization: 'invalid-token' }
        });

        expect(res.statusCode).to.equal(404); // 在我们的实现中，无效 token 返回 404
        expect(res.result.message).to.equal('User not found');
        expect(getUserFromTokenStub.calledOnce).to.be.true();
    });

    it('returns 404 when token is valid but user does not exist', async () => {

        // 模拟 token 有效但用户不存在的情况
        getUserFromTokenStub.withArgs('valid-token-no-user').resolves(null);

        const res = await server.inject({
            url: '/api/user/profile',
            headers: { authorization: 'valid-token-no-user' }
        });

        expect(res.statusCode).to.equal(404);
        expect(res.result.message).to.equal('User not found');
        expect(getUserFromTokenStub.calledOnce).to.be.true();
    });

    it('returns 200 with user data when token is valid and user exists', async () => {

        const mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
        };

        // 模拟 token 有效且用户存在的情况
        getUserFromTokenStub.withArgs('valid-token-with-user').resolves(mockUser);

        const res = await server.inject({
            url: '/api/user/profile',
            headers: { authorization: 'valid-token-with-user' }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.user).to.be.an.object();
        expect(res.result.user.id).to.equal(1);
        expect(res.result.user.username).to.equal('testuser');
        expect(res.result.user.email).to.equal('test@example.com');
        expect(getUserFromTokenStub.calledOnce).to.be.true();
    });
});
