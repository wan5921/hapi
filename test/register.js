'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const UserRoutes = require('../routes/user');


const internals = {
    createServer() {

        const server = Hapi.server();
        UserRoutes.reset();
        server.route(UserRoutes);
        return server;
    }
};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('register route', () => {

    it('registers a user successfully', async () => {

        const server = internals.createServer();
        const payload = {
            username: 'tester',
            email: 'tester@example.com',
            password: 'secret123'
        };

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).to.equal({
            id: 1,
            username: 'tester',
            email: 'tester@example.com'
        });
        expect(res.result.password).to.not.exist();
        expect(UserRoutes.users).to.have.length(1);
        expect(UserRoutes.users[0].passwordHash).to.exist();
        expect(UserRoutes.users[0].passwordHash).to.not.equal(payload.password);
    });

    it('rejects an invalid email address', async () => {

        const server = internals.createServer();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'tester',
                email: 'invalid-email',
                password: 'secret123'
            }
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.message).to.equal('请求体校验失败');
        expect(res.result.details).to.have.length(1);
        expect(res.result.details[0].message).to.contain('email');
    });

    it('rejects a username shorter than 3 characters', async () => {

        const server = internals.createServer();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'ab',
                email: 'tester@example.com',
                password: 'secret123'
            }
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.message).to.equal('请求体校验失败');
        expect(res.result.details).to.have.length(1);
        expect(res.result.details[0].message).to.contain('username');
    });
});
