FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci --omit=dev
COPY . .

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and all source files from builder
COPY --from=builder /app ./

EXPOSE 8000
CMD ["npm", "run", "start"]
