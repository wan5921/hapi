'use strict';

const Hapi = require('@hapi/hapi');
const strategies = require('./auth/strategies');
const JWT = require('jsonwebtoken');

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  const secretKey = 'your-secret-key-change-this-in-production';

  server.auth.scheme('jwt', strategies.jwt);
  server.auth.strategy('jwt', 'jwt', { secretKey });
  server.auth.default('jwt');

  server.route([
    {
      method: 'GET',
      path: '/',
      options: {
        auth: false,
        handler: (request, h) => {
          return { message: 'Welcome! This is a public route' };
        }
      }
    },
    {
      method: 'POST',
      path: '/login',
      options: {
        auth: false,
        handler: (request, h) => {
          const token = JWT.sign(
            { sub: 'user123', scope: ['user'], name: 'John Doe' },
            secretKey,
            { expiresIn: '1h' }
          );
          return { token };
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
            message: 'This is a protected route',
            user: request.auth.credentials
          };
        }
      }
    },
    {
      method: 'GET',
      path: '/admin',
      options: {
        auth: {
          strategy: 'jwt',
          scope: 'admin'
        },
        handler: (request, h) => {
          return {
            message: 'This is an admin route',
            user: request.auth.credentials
          };
        }
      }
    }
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
