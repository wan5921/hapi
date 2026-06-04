'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const UserRoute = require('../routes/user');


const internals = {};


const { describe, it, beforeEach, afterEach } = exports.lab = Lab.script();
const expect = Code.expect;


describe('GET /api/user/profile', () => {

    let server;
    let getUserFromTokenStub;

    beforeEach(() => {

        server = Hapi.server();
        getUserFromTokenStub = Sinon.stub(UserRoute, 'getUserFromToken');
    });

    afterEach(() => {

        Sinon.restore();
        server = null;
    });

    it('returns 401 when no token is provided', async () => {

        await server.register(UserRoute);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile'
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Missing authentication token');
    });

    it('returns 404 when token is invalid', async () => {

        getUserFromTokenStub.resolves(null);

        await server.register(UserRoute);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer invalid-token'
            }
        });

        expect(res.statusCode).to.equal(404);
        expect(res.result.message).to.equal('User not found');
        Sinon.assert.calledOnce(getUserFromTokenStub);
        Sinon.assert.calledWith(getUserFromTokenStub, 'Bearer invalid-token');
    });

    it('returns 404 when token is valid but user does not exist', async () => {

        getUserFromTokenStub.resolves(null);

        await server.register(UserRoute);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer valid-token-but-no-user'
            }
        });

        expect(res.statusCode).to.equal(404);
        expect(res.result.message).to.equal('User not found');
        Sinon.assert.calledOnce(getUserFromTokenStub);
    });

    it('returns 200 with user profile when token is valid and user exists', async () => {

        const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        };

        getUserFromTokenStub.resolves(mockUser);

        await server.register(UserRoute);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer valid-token-123'
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.user).to.exist();
        expect(res.result.user.id).to.equal(1);
        expect(res.result.user.name).to.equal('John Doe');
        expect(res.result.user.email).to.equal('john@example.com');
        Sinon.assert.calledOnce(getUserFromTokenStub);
        Sinon.assert.calledWith(getUserFromTokenStub, 'Bearer valid-token-123');
    });
});
