'use strict';

const Crypto = require('crypto');

let Joi;

try {
    Joi = require('@hapi/joi');
}
catch (err) {
    Joi = require('joi');
}

let Bcrypt;

try {
    Bcrypt = require('bcrypt');
}
catch (err) {
    try {
        Bcrypt = require('bcryptjs');
    }
    catch (innerErr) {
        Bcrypt = null;
    }
}

const internals = {
    users: [],
    nextId: 1,
    async hashPassword(password) {

        if (Bcrypt) {
            return Bcrypt.hash(password, 10);
        }

        const salt = Crypto.randomBytes(16).toString('hex');
        const hash = Crypto.scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    },
    validationError(_request, h, err) {

        return h.response({
            statusCode: 400,
            error: 'Bad Request',
            message: '请求体校验失败',
            details: err.details
        }).code(400).takeover();
    },
    sanitizeUser(user) {

        return {
            id: user.id,
            username: user.username,
            email: user.email
        };
    },
    reset() {

        internals.users.length = 0;
        internals.nextId = 1;
    }
};

const routes = [
    {
        method: 'POST',
        path: '/api/register',
        options: {
            auth: false,
            validate: {
                validator: Joi,
                options: {
                    abortEarly: false
                },
                payload: Joi.object({
                    username: Joi.string().min(3).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required()
                }),
                failAction: internals.validationError
            }
        },
        handler: async (request, h) => {

            const { username, email, password } = request.payload;
            const passwordHash = await internals.hashPassword(password);
            const user = {
                id: internals.nextId++,
                username,
                email,
                passwordHash
            };

            internals.users.push(user);

            return h.response(internals.sanitizeUser(user)).code(201);
        }
    }
];

module.exports = routes;
module.exports.reset = internals.reset;
module.exports.users = internals.users;
