FROM node:24.18.0-alpine3.24@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R node:node /home/node

USER node

RUN npm -v && \
    npm install && \
    npm run pretest

FROM node:24.18.0-alpine3.24@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS production

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
