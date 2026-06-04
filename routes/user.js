'use strict';

const Bcrypt = require('bcryptjs');
const Joi = require('joi');


const internals = {
    users: []
};


internals.schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});


module.exports = {
    name: 'user-routes',
    register: function (server, options) {

        server.validator(Joi);

        server.route({
            method: 'POST',
            path: '/api/register',
            handler: async (request, h) => {

                const { username, email, password } = request.payload;

                const salt = await Bcrypt.genSalt(10);
                const hashedPassword = await Bcrypt.hash(password, salt);

                const user = {
                    id: internals.users.length + 1,
                    username,
                    email,
                    password: hashedPassword
                };

                internals.users.push(user);

                return h.response({
                    id: user.id,
                    username: user.username,
                    email: user.email
                }).code(201);
            },
            options: {
                validate: {
                    payload: internals.schema,
                    failAction: (request, h, err) => {

                        throw err;
                    }
                }
            }
        });
    }
};
