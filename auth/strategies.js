'use strict';

const Boom = require('@hapi/boom');
const JWT = require('jsonwebtoken');

module.exports = {
  jwt: function (server, options) {
    const scheme = {
      authenticate: async function (request, h) {
        let token = null;
        let isValid = false;
        
        try {
          const authorization = request.headers.authorization;
          
          console.log('JWT Authentication - Starting validation, Authorization header:', authorization);
          
          if (!authorization) {
            console.log('JWT Authentication - Missing authorization header, isValid:', isValid);
            throw Boom.unauthorized(null, 'Bearer');
          }
          
          const match = authorization.match(/^Bearer\s+(.+)$/);
          if (!match) {
            console.log('JWT Authentication - Invalid Bearer format (strict case check), isValid:', isValid);
            throw Boom.unauthorized('Invalid authorization format, expected Bearer <token>', 'Bearer');
          }
          
          token = match[1];
          console.log('JWT Authentication - Extracted token:', token);
          
          let decoded;
          try {
            decoded = JWT.verify(token, options.secretKey);
            isValid = true;
            console.log('JWT Authentication - Token successfully decoded, isValid:', isValid);
          } catch (jwtErr) {
            console.log('JWT Authentication - Token verification failed, isValid:', isValid, 'Error:', jwtErr.message);
            throw Boom.unauthorized('Invalid token', 'Bearer');
          }
          
          const credentials = {
            user: decoded.sub,
            scope: decoded.scope || [],
            ...decoded
          };
          
          console.log('JWT Authentication - Authentication successful, isValid:', isValid, 'Credentials:', credentials);
          return h.authenticated({ credentials, artifacts: { token } });
          
        } catch (err) {
          console.error('JWT Authentication - Error during authentication, isValid:', isValid, 'Error:', err);
          
          if (err.isBoom) {
            throw err;
          }
          
          console.error('JWT Authentication - Unexpected error, returning unauthorized, isValid:', false);
          throw Boom.unauthorized('Authentication failed', 'Bearer');
        }
      }
    };
    
    return scheme;
  }
};
