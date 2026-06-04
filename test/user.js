'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Hapi = require('..');
const UserRoute = require('../routes/user.js');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

describe('POST /api/register', () => {

    const buildServer = () => {

        const server = Hapi.server();
        server.route(UserRoute);
        return server;
    };

    it('returns 201 and user info on successful registration', async () => {

        const server = buildServer();
        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).to.include(['id', 'username', 'email']);
        expect(res.result.username).to.equal('testuser');
        expect(res.result.email).to.equal('test@example.com');
        expect(res.result.password).to.not.exist(); // Ensure password is not returned
    });

    it('returns 400 when email is invalid', async () => {

        const server = buildServer();
        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'invalid-email',
                password: 'password123'
            }
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.contain('"email" must be a valid email');
    });

    it('returns 400 when username is too short', async () => {

        const server = buildServer();
        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'ab',
                email: 'test@example.com',
                password: 'password123'
            }
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.contain('"username" length must be at least 3 characters long');
    });

    it('returns 400 when password is too short', async () => {

        const server = buildServer();
        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'test@example.com',
                password: '12345'
            }
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.error).to.equal('Bad Request');
        expect(res.result.message).to.contain('"password" length must be at least 6 characters long');
    });
});
