'use strict';

const Joi = require('joi');
const bcrypt = require('bcrypt');

// 模拟用户数据库
const users = new Map();

// 注册用户的路由处理函数
const registerUser = async (request, h) => {
    const { username, email, password } = request.payload;

    // 检查用户是否已存在
    if (users.has(email)) {
        return h.response({ message: 'Email already registered' }).code(409);
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 创建新用户对象（不包含密码）
    const newUser = {
        id: Date.now(),
        username,
        email,
        createdAt: new Date().toISOString()
    };

    // 保存到数据库（同时保存密码）
    users.set(email, { ...newUser, password: hashedPassword });

    // 返回用户信息（不包含密码）
    return h.response(newUser).code(201);
};

// 定义注册路由
const registerRoute = {
    method: 'POST',
    path: '/api/register',
    options: {
        validate: {
            payload: Joi.object({
                username: Joi.string().min(3).required().messages({
                    'string.min': 'Username must be at least 3 characters long',
                    'any.required': 'Username is required'
                }),
                email: Joi.string().email().required().messages({
                    'string.email': 'Email must be a valid email address',
                    'any.required': 'Email is required'
                }),
                password: Joi.string().min(6).required().messages({
                    'string.min': 'Password must be at least 6 characters long',
                    'any.required': 'Password is required'
                })
            }),
            failAction: (request, h, error) => {
                const errorDetails = error.details.map(detail => ({
                    field: detail.context.key,
                    message: detail.message
                }));
                return h.response({ errors: errorDetails }).code(400).takeover();
            }
        },
        handler: registerUser,
        tags: ['api', 'user']
    }
};

module.exports = {
    registerRoute,
    routes: [registerRoute]
};
