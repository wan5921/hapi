'use strict';

const Code = require('@hapi/code');
const Hapi = require('..');
const Lab = require('@hapi/lab');
const { registerRoute } = require('../routes/user');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

describe('User Registration API', () => {

    it('should register a user successfully with valid data', async () => {

        const server = Hapi.server();
        server.route(registerRoute);

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
        expect(res.result.id).to.exist();
        expect(res.result.password).to.not.exist();
    });

    it('should return 400 when email is invalid', async () => {

        const server = Hapi.server();
        server.route(registerRoute);

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
        expect(res.result.errors).to.be.an.array();
        expect(res.result.errors.some(err => err.field === 'email')).to.be.true();
    });

    it('should return 400 when username is too short', async () => {

        const server = Hapi.server();
        server.route(registerRoute);

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
        expect(res.result.errors).to.be.an.array();
        expect(res.result.errors.some(err => err.field === 'username')).to.be.true();
    });

    it('should return 400 when password is too short', async () => {

        const server = Hapi.server();
        server.route(registerRoute);

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
        expect(res.result.errors).to.be.an.array();
        expect(res.result.errors.some(err => err.field === 'password')).to.be.true();
    });

    it('should return 400 when required fields are missing', async () => {

        const server = Hapi.server();
        server.route(registerRoute);

        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {}
        });

        expect(res.statusCode).to.equal(400);
        expect(res.result.errors).to.be.an.array();
        expect(res.result.errors.length).to.be.at.least(3);
    });

    it('should return 409 when email is already registered', async () => {

        const server = Hapi.server();
        server.route(registerRoute);

        // 第一次注册
        await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'testuser',
                email: 'duplicate@example.com',
                password: 'password123'
            }
        });

        // 尝试用相同邮箱再次注册
        const res = await server.inject({
            method: 'POST',
            url: '/api/register',
            payload: {
                username: 'anotheruser',
                email: 'duplicate@example.com',
                password: 'password123'
            }
        });

        expect(res.statusCode).to.equal(409);
        expect(res.result.message).to.equal('Email already registered');
    });
});
