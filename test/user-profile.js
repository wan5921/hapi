'use strict';

const Boom = require('@hapi/boom');
const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');
const UserRoute = require('../routes/user');


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


const internals = {
    createServer(getUserFromToken) {

        const server = Hapi.server();
        server.route(UserRoute({ getUserFromToken }));
        return server;
    }
};


describe('GET /api/user/profile', () => {

    it('returns 401 when token is missing', async () => {

        const sandbox = Sinon.createSandbox();
        const getUserFromToken = sandbox.stub();
        const server = internals.createServer(getUserFromToken);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile'
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Missing token');
        expect(getUserFromToken.called).to.be.false();

        sandbox.restore();
    });

    it('returns 401 when token is invalid', async () => {

        const sandbox = Sinon.createSandbox();
        const getUserFromToken = sandbox.stub().rejects(Boom.unauthorized('Invalid token'));
        const server = internals.createServer(getUserFromToken);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer invalid-token'
            }
        });

        expect(res.statusCode).to.equal(401);
        expect(res.result.message).to.equal('Invalid token');
        expect(getUserFromToken.calledOnceWithExactly('invalid-token')).to.be.true();

        sandbox.restore();
    });

    it('returns 404 when token is valid but user does not exist', async () => {

        const sandbox = Sinon.createSandbox();
        const getUserFromToken = sandbox.stub().resolves(null);
        const server = internals.createServer(getUserFromToken);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer missing-user-token'
            }
        });

        expect(res.statusCode).to.equal(404);
        expect(res.result.message).to.equal('User not found');
        expect(getUserFromToken.calledOnceWithExactly('missing-user-token')).to.be.true();

        sandbox.restore();
    });

    it('returns 200 and user when token is valid and user exists', async () => {

        const sandbox = Sinon.createSandbox();
        const user = {
            id: 'user-1',
            name: 'Alice'
        };
        const getUserFromToken = sandbox.stub().resolves(user);
        const server = internals.createServer(getUserFromToken);

        const res = await server.inject({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                authorization: 'Bearer valid-token'
            }
        });

        expect(res.statusCode).to.equal(200);
        expect(res.result.user).to.equal(user);
        expect(getUserFromToken.calledOnceWithExactly('valid-token')).to.be.true();

        sandbox.restore();
    });
});
