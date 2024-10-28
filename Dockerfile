FROM node:20-alpine

ARG P_USER_NAME=app
ARG P_UID=21001
ENV NODE_ENV=production HOME=/app

# Create a new user to our new container and avoid the root userx
RUN addgroup --gid ${P_UID} ${P_USER_NAME} && \
    adduser --disabled-password --uid ${P_UID} ${P_USER_NAME} -G ${P_USER_NAME} && \
    mkdir -p ${HOME} && \
    chown -R ${P_UID}:${P_UID} ${HOME}

WORKDIR ${HOME}
USER ${P_UID}

ADD --chown="21001:21001" package*.json ./

RUN yarn install --production --frozen-lockfile && \
    rm -rf yarn.lock .cache .npm .yarn .next/cache



ADD --chown="21001:21001" public ./public
ADD --chown="21001:21001" .next ./.next
ADD --chown="21001:21001" next.config.js ./next.config.js
ADD --chown="21001:21001" next-i18next.config.js ./next-i18next.config.js

CMD npm start

# HEALTHCHECK CMD node ./scripts/ping.js
