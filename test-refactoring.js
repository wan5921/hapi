'use strict';

const Hapi = require('./lib');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

describe('Refactoring Test', () => {
    let server;

    it('should create server and register routes', async () => {
        server = Hapi.server();

        require('./routes/users').register(server);
        require('./routes/posts').register(server);

        expect(server).to.exist();
    });

    it('should return 401 without authorization header', async () => {
        const res1 = await server.inject({ method: 'GET', url: '/users' });
        expect(res1.statusCode).to.equal(401);
        expect(res1.result.message).to.equal('Missing authorization header');

        const res2 = await server.inject({ method: 'GET', url: '/posts' });
        expect(res2.statusCode).to.equal(401);
        expect(res2.result.message).to.equal('Missing authorization header');
    });

    it('should return 401 with invalid authorization header', async () => {
        const res1 = await server.inject({ 
            method: 'GET', 
            url: '/users', 
            headers: { authorization: 'Basic invalid' } 
        });
        expect(res1.statusCode).to.equal(401);
        expect(res1.result.message).to.equal('Invalid authorization header format');

        const res2 = await server.inject({ 
            method: 'GET', 
            url: '/posts', 
            headers: { authorization: 'Bearer invalid-token' } 
        });
        expect(res2.statusCode).to.equal(401);
        expect(res2.result.message).to.equal('Invalid token');
    });

    it('should return 200 with valid token', async () => {
        const res1 = await server.inject({ 
            method: 'GET', 
            url: '/users', 
            headers: { authorization: 'Bearer valid-token' } 
        });
        expect(res1.statusCode).to.equal(200);
        expect(res1.result).to.be.an.array();

        const res2 = await server.inject({ 
            method: 'GET', 
            url: '/posts', 
            headers: { authorization: 'Bearer valid-token' } 
        });
        expect(res2.statusCode).to.equal(200);
        expect(res2.result).to.be.an.array();
    });

    it('should get a single user and post with valid token', async () => {
        const res1 = await server.inject({ 
            method: 'GET', 
            url: '/users/john', 
            headers: { authorization: 'Bearer valid-token' } 
        });
        expect(res1.statusCode).to.equal(200);
        expect(res1.result.name).to.equal('John Doe');

        const res2 = await server.inject({ 
            method: 'GET', 
            url: '/posts/1', 
            headers: { authorization: 'Bearer valid-token' } 
        });
        expect(res2.statusCode).to.equal(200);
        expect(res2.result.title).to.equal('First Post');
    });
});
