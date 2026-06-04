'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const UserRoutes = require('../routes/user');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('Register', () => {

    const provision = async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);
        return server;
    };

    it('registers a new user successfully', async () => {

        const server = await provision();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'test@example.com',
                password: '123456'
            }
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).to.include({
            username: 'testuser',
            email: 'test@example.com'
        });
        expect(res.result).to.not.include('password');
        expect(res.result.id).to.exist();
    });

    it('returns 400 when email is invalid', async () => {

        const server = await provision();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'invalid-email',
                password: '123456'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when username is too short', async () => {

        const server = await provision();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'ab',
                email: 'test@example.com',
                password: '123456'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when password is too short', async () => {

        const server = await provision();

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

    it('returns 400 when username is missing', async () => {

        const server = await provision();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                email: 'test@example.com',
                password: '123456'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when email is missing', async () => {

        const server = await provision();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                password: '123456'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when password is missing', async () => {

        const server = await provision();

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'test@example.com'
            }
        });

        expect(res.statusCode).to.equal(400);
    });
});
