FROM node:24.16.0-alpine3.24@sha256:21f403ab171f2dc89bad4dd69d7721bfd15f084ccb46cdd225f31f2bc59b5c9a AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R node:node /home/node

USER node

RUN npm -v && \
    npm install && \
    npm run pretest

FROM node:24.16.0-alpine3.24@sha256:21f403ab171f2dc89bad4dd69d7721bfd15f084ccb46cdd225f31f2bc59b5c9a AS production

WORKDIR /home/node

COPY --from=builder /home/node/dst/ ./dst/
COPY --from=builder /home/node/node_modules ./node_modules

COPY ./package.json /home/node
COPY ./user.json /home/node
COPY ./configuration.json /home/node
COPY ./nodesets /home/node/nodesets
COPY ./models /home/node/models
COPY ./healthcheck.js /home/node/healthcheck.js

RUN chown -R node:node /home/node

USER node

HEALTHCHECK --interval=30s CMD node /home/node/healthcheck.js

EXPOSE 4840

ENTRYPOINT ["node", "./dst/src/server.js"]
