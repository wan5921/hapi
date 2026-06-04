'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const sinon = require('sinon');

// 尝试加载 hapi 模块，如果在 Hapi 源码仓库内则使用 '..'，否则使用 '@hapi/hapi'
let Hapi;
try {
    Hapi = require('@hapi/hapi');
} catch (err) {
    Hapi = require('..');
}

const UserRouteModule = require('../routes/user');

const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

describe('GET /api/user/profile', () => {
    let server;

    beforeEach(async () => {
        server = Hapi.server();
        server.route(UserRouteModule.route);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('场景一：未携带 token，返回 401', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile'
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result).to.be.an.object();
        expect(res.result.message).to.exist();
        expect(res.result.message).to.equal('未携带 token');
    });

    it('场景二：token 无效，返回 401', async () => {
        sinon.stub(UserRouteModule, 'getUserFromToken').rejects(new Error('Invalid token'));

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer invalid_token'
            }
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result).to.be.an.object();
        expect(res.result.message).to.exist();
        expect(res.result.message).to.equal('token 无效');
    });

    it('场景三：token 有效但用户不存在，返回 404', async () => {
        sinon.stub(UserRouteModule, 'getUserFromToken').resolves(null);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer valid_token_no_user'
            }
        });

        expect(res.statusCode).to.equal(404);
        expect(res.result).to.be.an.object();
        expect(res.result.message).to.exist();
        expect(res.result.message).to.equal('用户不存在');
    });

    it('场景四：token 有效且用户存在，返回 200', async () => {
        const mockUser = { id: 123, name: 'Test User' };
        sinon.stub(UserRouteModule, 'getUserFromToken').resolves(mockUser);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer valid_token'
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result).to.be.an.object();
        expect(res.result.user).to.equal(mockUser);
    });
});
