'use strict';

const Boom = require('@hapi/boom');
const { getUserFromToken } = require('../plugins/auth-utils');

const posts = [
    { id: 1, title: 'First Post', content: 'Hello World', author: 'john' },
    { id: 2, title: 'Second Post', content: 'Hapi is Awesome', author: 'jane' }
];

exports.register = function (server) {
    server.route({
        method: 'GET',
        path: '/posts/{id}',
        handler: async (request, h) => {
            getUserFromToken(request.headers.authorization);

            const post = posts.find(p => p.id === parseInt(request.params.id));
            if (!post) {
                throw Boom.notFound('Post not found');
            }

            return post;
        }
    });

    server.route({
        method: 'GET',
        path: '/posts',
        handler: async (request, h) => {
            getUserFromToken(request.headers.authorization);

            return posts;
        }
    });
};
