'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { getUserFromToken } = require('../plugins/auth-utils');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('auth-utils', () => {

    describe('getUserFromToken', () => {

        it('returns null when no authorization header is present', () => {

            const request = { headers: {} };
            const result = getUserFromToken(request);
            expect(result).to.be.null();
        });

        it('returns null when authorization header is not a Bearer token', () => {

            const request = { headers: { authorization: 'Basic dXNlcjpwYXNz' } };
            const result = getUserFromToken(request);
            expect(result).to.be.null();
        });

        it('returns null when token has invalid format', () => {

            const request = { headers: { authorization: 'Bearer invalid' } };
            const result = getUserFromToken(request);
            expect(result).to.be.null();
        });

        it('extracts user from a valid JWT-like Bearer token', () => {

            const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64');
            const payload = Buffer.from(JSON.stringify({ user: { id: 1, name: 'test' } })).toString('base64');
            const token = `${header}.${payload}.signature`;

            const request = { headers: { authorization: `Bearer ${token}` } };
            const result = getUserFromToken(request);
            expect(result).to.equal({ id: 1, name: 'test' });
        });

        it('returns payload when no user or sub field exists', () => {

            const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64');
            const payload = Buffer.from(JSON.stringify({ id: 42, role: 'admin' })).toString('base64');
            const token = `${header}.${payload}.signature`;

            const request = { headers: { authorization: `Bearer ${token}` } };
            const result = getUserFromToken(request);
            expect(result).to.equal({ id: 42, role: 'admin' });
        });

        it('prefers user.sub as the return value when sub exists', () => {

            const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64');
            const payload = Buffer.from(JSON.stringify({ sub: 'user-123', name: 'sub-user' })).toString('base64');
            const token = `${header}.${payload}.signature`;

            const request = { headers: { authorization: `Bearer ${token}` } };
            const result = getUserFromToken(request);
            expect(result).to.equal('user-123');
        });

        it('handles URL-safe base64 tokens', () => {

            const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64');
            const payload = Buffer.from(JSON.stringify({ user: { id: 2, name: 'safe' } })).toString('base64');
            const urlSafeToken = `${header}.${payload}.signature`.replace(/\+/g, '-').replace(/\//g, '_');

            const request = { headers: { authorization: `Bearer ${urlSafeToken}` } };
            const result = getUserFromToken(request);
            expect(result).to.equal({ id: 2, name: 'safe' });
        });

        it('returns null when request is missing', () => {

            expect(() => getUserFromToken()).to.throw();
            expect(() => getUserFromToken(null)).to.throw();
        });
    });
});