'use strict';

const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');

module.exports = {
  jwt: function (server, options) {
    const scheme = {
      authenticate: async function (request, h) {
        console.log('JWT Authentication - Request headers:', request.headers);
        
        try {
          const authorization = request.headers.authorization;
          if (!authorization) {
            console.log('JWT Authentication - Missing authorization header');
            throw Boom.unauthorized(null, 'Bearer');
          }

          console.log('JWT Authentication - Authorization header:', authorization);
          
          const match = authorization.match(/^Bearer\s+(.+)$/i);
          if (!match) {
            console.log('JWT Authentication - Invalid Bearer format');
            throw Boom.unauthorized('Invalid authorization format, expected Bearer <token>', 'Bearer');
          }

          const token = match[1];
          console.log('JWT Authentication - Extracting token:', token);

          let decoded;
          try {
            decoded = JWT.verify(token, options.secretKey);
            console.log('JWT Authentication - Token successfully decoded:', decoded);
          } catch (jwtErr) {
            console.log('JWT Authentication - Token verification failed:', jwtErr.message);
            throw Boom.unauthorized('Invalid token', 'Bearer');
          }

          const credentials = {
            user: decoded.sub,
            scope: decoded.scope || [],
            ...decoded
          };

          console.log('JWT Authentication - Authentication successful, credentials:', credentials);
          return h.authenticated({ credentials, artifacts: { token } });

        } catch (err) {
          console.error('JWT Authentication - Error during authentication:', err);
          throw err;
        }
      }
    };

    return scheme;
  }
};
