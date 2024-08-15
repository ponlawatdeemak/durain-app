# # Multi-stage build docker

# # 1st Stage
FROM node:20-alpine AS builder
WORKDIR /app

# COPY package*.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN yarn build

# # 2nd Stage
FROM node:20-alpine AS runner

# node image comes with rootless user "node" by default
WORKDIR /home/node
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/next.config.mjs ./next.config.mjs
COPY --chown=node:node --from=builder /app/next-i18next.config.js ./next-i18next.config.js

USER node
EXPOSE 3000
CMD ["yarn", "start"]
