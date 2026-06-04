'use strict';

const Joi = require('joi');
const crypto = require('crypto');

const internals = {
    users: [] // Simple in-memory store for demonstration
};

module.exports = {
    method: 'POST',
    path: '/api/register',
    options: {
        validate: {
            payload: Joi.object({
                username: Joi.string().min(3).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            })
            // Hapi automatically returns 400 Bad Request with error details on validation failure
        }
    },
    handler: async (request, h) => {

        const { username, email, password } = request.payload;

        // Hash password using crypto as a built-in alternative to bcrypt
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        const newUser = {
            id: internals.users.length + 1,
            username,
            email,
            password: hashedPassword,
            salt
        };

        internals.users.push(newUser);

        // Exclude password and salt from the response
        return h.response({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }).code(201);
    }
};
