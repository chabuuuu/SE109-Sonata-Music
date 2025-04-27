# Stage 1: Build Stage
FROM node:21-alpine3.19 AS builder

WORKDIR /opt/app

# Cài npm phiên bản mới nhất và đặt NODE_ENV là production
RUN npm i -g npm@10

# Cài đặt curl để health check
RUN apk add --no-cache curl

# Copy package.json trước để cache dependencies
COPY package.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ code vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Stage 2: Runtime Stage
FROM node:21-slim AS runner

WORKDIR /opt/app

# Cài đặt curl để health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Chỉ copy thư mục cần thiết từ builder stage để giảm kích thước image
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/package.json ./
COPY --from=builder /opt/app/node_modules ./node_modules

EXPOSE 80

# Chạy Next.js trong chế độ production
CMD ["node", "node_modules/.bin/next", "start", "-p", "80"]
