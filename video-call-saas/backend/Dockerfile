FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci --omit=dev

COPY . .


FROM node:22-alpine AS production
WORKDIR /app

RUN npm install apminsight --save


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

EXPOSE 8000

CMD ["npm", "run", "start"]
