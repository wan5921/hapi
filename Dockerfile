FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 运行 npm ci --only=production
RUN npm ci --only=production

# 复制源码
COPY . .

# 暴露端口 3000
EXPOSE 3000

# 运行应用
CMD ["node", "server.js"]
