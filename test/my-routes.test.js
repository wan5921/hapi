'use strict';

const assert = require('assert');
const { getUserProfile } = require('../routes/user');
const { getOrders } = require('../routes/order');

function createMockRes() {
    const res = {
        statusCode: null,
        data: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            this.data = data;
            return this;
        }
    };
    return res;
}

function runTests() {
    console.log('Running tests...');
    
    // Test user.js
    let req = { headers: { authorization: 'valid-token-user1' } };
    let res = createMockRes();
    getUserProfile(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.data.profile.username, 'user1');

    req = { headers: {} };
    res = createMockRes();
    getUserProfile(req, res);
    assert.strictEqual(res.statusCode, 401);
    
    // Test order.js
    req = { headers: { authorization: 'valid-token-admin' } };
    res = createMockRes();
    getOrders(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.orders[0].id, 101);

    req = { headers: { authorization: 'invalid' } };
    res = createMockRes();
    getOrders(req, res);
    assert.strictEqual(res.statusCode, 401);

    console.log('All unit tests passed.');
}

runTests();
