'use strict';

const Bcrypt = require('bcrypt');
const Joi = require('joi');


const internals = {
    users: []
};


module.exports = {
    name: 'user-routes',
    internals,
    register: function (server, options) {

        server.validator(Joi);

        server.route({
            method: 'POST',
            path: '/api/register',
            options: {
                validate: {
                    payload: Joi.object({
                        username: Joi.string().min(3).required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().min(6).required()
                    }),
                    failAction: (request, h, err) => err
                }
            },
            handler: async (request, h) => {

                const { username, email, password } = request.payload;

                const saltRounds = 10;
                const hashedPassword = await Bcrypt.hash(password, saltRounds);

                const user = {
                    id: internals.users.length + 1,
                    username,
                    email,
                    password: hashedPassword
                };

                internals.users.push(user);

                const { password: _, ...safeUser } = user;

                return h.response(safeUser).code(201);
            }
        });
    }
};