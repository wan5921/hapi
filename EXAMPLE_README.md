# Hapi 用户路由集成示例

## 文件说明

我为你创建了以下示例文件：

1. **example-package.json** - 项目依赖配置
2. **example-server.js** - 服务器主文件
3. **example-routes-user.js** - 用户路由（核心实现）
4. **example-models-db.js** - 模拟数据库

## 核心实现详解

### 1. 用户路由实现 (example-routes-user.js)

```javascript
{
    method: 'GET',
    path: '/user',
    handler: async (request, h) => {
        // 从 auth.credentials 获取用户 ID
        const userId = request.auth.credentials.userId;
        
        // 查询数据库
        const user = await db.getUserById(userId);
        
        // 用户不存在返回 404
        if (!user) {
            throw Boom.notFound('User not found');
        }
        
        // 返回用户信息
        return {
            email: user.email,
            username: user.username,
            createdAt: user.createdAt
        };
    },
    options: {
        auth: 'jwt',
        description: 'Get current user information',
        tags: ['api', 'user']
    }
}
```

### 2. JWT 认证配置 (example-server.js)

```javascript
server.auth.strategy('jwt', 'jwt', {
    key: 'your-secret-key',
    validate: async (decoded) => {
        const user = await db.getUserById(decoded.userId);
        if (user) {
            // 挂载 userId 到 credentials
            return { isValid: true, credentials: { userId: decoded.userId } };
        }
        return { isValid: false };
    },
    verifyOptions: { algorithms: ['HS256'] }
});
```

### 3. 路由注册方式

在 `example-server.js` 中，通过以下方式集成路由：

```javascript
const userRoutes = require('./example-routes-user');
server.route(userRoutes);
```

## 集成到现有项目的步骤

### 步骤 1：安装依赖

```bash
npm install @hapi/hapi @hapi/boom hapi-auth-jwt2
```

### 步骤 2：创建路由文件

将 `example-routes-user.js` 复制到你的项目的 `routes/user.js`

### 步骤 3：配置 JWT 认证策略

在你的服务器初始化代码中，注册 JWT 策略并确保 `validate` 函数将用户 ID 挂载到 `credentials` 对象。

### 步骤 4：注册路由

```javascript
const userRoutes = require('./routes/user');
server.route(userRoutes);
```

### 步骤 5：替换数据库模块

在实际项目中，将 `example-models-db.js` 替换为你项目真实的数据库查询模块。

## 测试

### 生成测试用 JWT Token

你可以使用以下代码生成 JWT Token：

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: '1' }, 'your-secret-key', { algorithm: 'HS256' });
```

### 使用 Token 请求 API

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/user
```

## 响应示例

成功响应 (200):
```json
{
  "email": "user1@example.com",
  "username": "user1",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

用户不存在响应 (404):
```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "User not found"
}
```
