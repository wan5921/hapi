'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const UserRoutes = require('../routes/user');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('POST /api/register', () => {

    it('registers a new user successfully', async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'alice',
                email: 'alice@example.com',
                password: 'secret123'
            }
        });

        expect(res.statusCode).to.equal(201);
        expect(res.result).to.contain({
            id: 1,
            username: 'alice',
            email: 'alice@example.com'
        });
        expect(res.result.password).to.not.exist();
    });

    it('returns 400 when email is invalid', async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'alice',
                email: 'not-an-email',
                password: 'secret123'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when username is too short', async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'ab',
                email: 'alice@example.com',
                password: 'secret123'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when password is too short', async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'alice',
                email: 'alice@example.com',
                password: '12345'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('returns 400 when required fields are missing', async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'alice'
            }
        });

        expect(res.statusCode).to.equal(400);
    });

    it('stores password as bcrypt hash', async () => {

        const server = Hapi.server();
        await server.register(UserRoutes);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'alice',
                email: 'alice@example.com',
                password: 'secret123'
            }
        });

        expect(res.statusCode).to.equal(201);

        const Bcrypt = require('bcrypt');
        const storedUser = UserRoutes.internals.users[UserRoutes.internals.users.length - 1];
        const isMatch = await Bcrypt.compare('secret123', storedUser.password);
        expect(isMatch).to.be.true();
    });
});