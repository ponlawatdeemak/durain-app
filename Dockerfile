# # Multi-stage build docker

# # 1st Stage
FROM node:20-alpine AS builder
WORKDIR /app

# COPY package*.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

# COPY . .
COPY ./src /tmp/app/src
COPY package-lock.json /tmp/app/
COPY package.json /tmp/app/
COPY next.config.js /tmp/app/
COPY next-i18next.config.js /tmp/app/

ENV NODE_ENV=production
RUN yarn build

# # 2nd Stage
FROM node:20-alpine AS runner

RUN chmod -R g=u /app/public && \
    chmod -R g=u /app/.next && \
    chmod -R g=u /app/node_modules && \
    chmod -R g=u /app/package.json

# node image comes with rootless user "node" by default
WORKDIR /home/node
COPY --chown=node:node --chmod=755 --from=builder /app/public ./public
COPY --chown=node:node --chmod=755 --from=builder /app/.next ./.next
COPY --chown=node:node --chmod=755 --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --chmod=755 --from=builder /app/package.json ./package.json
COPY --chown=node:node --chmod=755 --from=builder /app/next.config.js ./next.config.js
COPY --chown=node:node --chmod=755 --from=builder /app/next-i18next.config.js ./next-i18next.config.js

USER node
EXPOSE 3000
CMD ["yarn", "start"]
