'use strict';

const Code = require('@hapi/code');
const Hapi = require('../lib');
const Lab = require('@hapi/lab');
const { registerRoute, users } = require('../routes/user');

const { describe, it, beforeEach } = exports.lab = Lab.script();
const expect = Code.expect;

describe('User Registration', () => {

    let server;

    beforeEach(async () => {

        users.length = 0;
        server = Hapi.server();
        server.route(registerRoute);
    });

    it('should register a new user successfully', async () => {

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
        expect(res.result).to.be.an.object();
        expect(res.result.username).to.equal('testuser');
        expect(res.result.email).to.equal('test@example.com');
        expect(res.result.password).to.not.exist();
        expect(res.result.id).to.exist();
    });

    it('should return 400 for invalid email', async () => {

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
    });

    it('should return 400 for too short username', async () => {

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
    });

    it('should return 400 for too short password', async () => {

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
    });

    it('should return 400 for missing required fields', async () => {

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('should return 409 for duplicate email or username', async () => {

        await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            }
        });

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'another@example.com',
                password: 'password123'
            }
        });

        expect(res.statusCode).to.equal(409);
    });
});
