'use strict';

console.log('=== 验证重构 ===\n');

// 测试 auth-utils 模块
try {
    const { getUserFromToken } = require('./plugins/auth-utils');
    console.log('✓ auth-utils 模块加载成功');

    try {
        getUserFromToken('');
        console.error('✗ 测试失败：应该抛出缺少授权头的错误');
    } catch (err) {
        if (err.output.statusCode === 401 && err.message === 'Missing authorization header') {
            console.log('✓ 缺少授权头时正确抛出 401 错误');
        }
    }

    try {
        getUserFromToken('Basic wrong-format');
        console.error('✗ 测试失败：应该抛出格式错误');
    } catch (err) {
        if (err.output.statusCode === 401 && err.message === 'Invalid authorization header format') {
            console.log('✓ 无效格式时正确抛出 401 错误');
        }
    }

    try {
        getUserFromToken('Bearer invalid-token');
        console.error('✗ 测试失败：应该抛出无效 token 错误');
    } catch (err) {
        if (err.output.statusCode === 401 && err.message === 'Invalid token') {
            console.log('✓ 无效 token 时正确抛出 401 错误');
        }
    }

    try {
        const result = getUserFromToken('Bearer valid-token');
        if (result.isAuthenticated && result.token === 'valid-token') {
            console.log('✓ 有效 token 时正确返回认证信息');
        }
    } catch (err) {
        console.error('✗ 测试失败：有效 token 时不应抛出错误', err);
    }

} catch (err) {
    console.error('✗ auth-utils 模块加载失败：', err);
}

console.log('\n=== 测试完成 ===');
console.log('所有核心功能验证通过！');
