'use strict';

const Hapi = require('.');
const { routes } = require('./routes/user');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 注册用户路由
    server.route(routes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
