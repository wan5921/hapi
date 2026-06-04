'use strict';

const Joi = require('joi');
const Bcrypt = require('bcrypt');

const users = [];

const registerRoute = {
    method: 'POST',
    path: '/api/register',
    options: {
        validate: {
            payload: Joi.object({
                username: Joi.string().min(3).required().label('Username'),
                email: Joi.string().email().required().label('Email'),
                password: Joi.string().min(6).required().label('Password')
            })
        }
    },
    handler: async (request, h) => {

        const { username, email, password } = request.payload;

        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return h.response({ error: 'User already exists' }).code(409);
        }

        const saltRounds = 10;
        const hashedPassword = await Bcrypt.hash(password, saltRounds);

        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword
        };

        users.push(newUser);

        const { password: _, ...userWithoutPassword } = newUser;

        return h.response(userWithoutPassword).code(201);
    }
};

module.exports = {
    registerRoute,
    users
};
