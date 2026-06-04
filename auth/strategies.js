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
          
          const validationResult = await validate(token, options.secretKey);
          
          console.log('JWT Authentication - Token validation result:', validationResult);
          
          isValid = validationResult.isValid;
          
          if (!isValid) {
            throw Boom.unauthorized('Invalid token', 'Bearer');
          }
          
          const credentials = {
            user: validationResult.decoded.sub,
            scope: validationResult.decoded.scope || [],
            ...validationResult.decoded
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

const validate = async (token, secretKey) => {
  console.log('JWT validate - Entering validate function, token:', token);
  
  try {
    const decoded = JWT.verify(token, secretKey);
    const result = { isValid: true, decoded };
    console.log('JWT validate - Token valid, result:', result);
    return result;
  } catch (error) {
    console.error('JWT validate - Token invalid, error:', error.message);
    const result = { isValid: false };
    console.log('JWT validate - Returning validation result:', result);
    return result;
  }
};
