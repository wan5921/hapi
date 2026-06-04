'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const UserRoute = require('../routes/user');


const { describe, it, afterEach } = exports.lab = Lab.script();
const expect = Code.expect;


describe('GET /api/user/profile', () => {

    afterEach(() => {

        Sinon.restore();
    });

    it('returns 401 when token is missing', async () => {

        const server = Hapi.server();
        server.route(UserRoute.route);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile'
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Missing token');
    });

    it('returns 401 when token is invalid', async () => {

        Sinon.stub(UserRoute, 'getUserFromToken').rejects(new Error('Invalid token'));

        const server = Hapi.server();
        server.route(UserRoute.route);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'invalid_token'
            }
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Invalid token');
    });

    it('returns 404 when token is valid but user does not exist', async () => {

        Sinon.stub(UserRoute, 'getUserFromToken').resolves(null);

        const server = Hapi.server();
        server.route(UserRoute.route);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'valid_token_no_user'
            }
        });

        expect(res.statusCode).to.equal(404);
        expect(res.result.message).to.equal('User not found');
    });

    it('returns 200 with user object when token is valid and user exists', async () => {

        const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com' };

        Sinon.stub(UserRoute, 'getUserFromToken').resolves(mockUser);

        const server = Hapi.server();
        server.route(UserRoute.route);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'valid_token'
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.user).to.equal(mockUser);
        expect(res.result.user.id).to.equal(1);
        expect(res.result.user.name).to.equal('Alice');
        expect(res.result.user.email).to.equal('alice@example.com');
    });
});