'use strict';

const Hapi = require('@hapi/hapi');
const strategies = require('./auth/strategies');
const JWT = require('jsonwebtoken');

const test = async () => {

  console.log('=== Starting JWT Strategy Test ===\n');

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  const secretKey = 'test-secret-key';

  server.auth.scheme('jwt', strategies.jwt);
  server.auth.strategy('jwt', 'jwt', { secretKey });

  server.route([
    {
      method: 'GET',
      path: '/public',
      options: {
        auth: false,
        handler: (request, h) => {
          return { message: 'Public route - no auth required' };
        }
      }
    },
    {
      method: 'GET',
      path: '/protected',
      options: {
        auth: 'jwt',
        handler: (request, h) => {
          return {
            message: 'Protected route - access granted',
            user: request.auth.credentials
          };
        }
      }
    }
  ]);

  // Test 1: Test public route
  console.log('\n--- Test 1: Public route (no auth) ---');
  try {
    const res = await server.inject('/public');
    console.log('Status:', res.statusCode);
    console.log('Result:', res.result);
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 2: Test protected route without token
  console.log('\n--- Test 2: Protected route (no token) ---');
  try {
    const res = await server.inject('/protected');
    console.log('Status:', res.statusCode);
    console.log('Result:', res.result);
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 3: Test protected route with invalid token format
  console.log('\n--- Test 3: Protected route (invalid token format) ---');
  try {
    const res = await server.inject({
      url: '/protected',
      headers: { authorization: 'InvalidFormat token123' }
    });
    console.log('Status:', res.statusCode);
    console.log('Result:', res.result);
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 4: Test protected route with invalid token
  console.log('\n--- Test 4: Protected route (invalid token) ---');
  try {
    const res = await server.inject({
      url: '/protected',
      headers: { authorization: 'Bearer invalid-token' }
    });
    console.log('Status:', res.statusCode);
    console.log('Result:', res.result);
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 5: Test protected route with valid token
  console.log('\n--- Test 5: Protected route (valid token) ---');
  try {
    const token = JWT.sign(
      { sub: 'testuser123', scope: ['user'], name: 'Test User' },
      secretKey,
      { expiresIn: '1h' }
    );
    
    console.log('Generated token:', token);
    
    const res = await server.inject({
      url: '/protected',
      headers: { authorization: `Bearer ${token}` }
    });
    console.log('Status:', res.statusCode);
    console.log('Result:', res.result);
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n=== Test Complete ===');
};

test();
