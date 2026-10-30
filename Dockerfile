FROM node:26.13.0-alpine3.24@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R 1000:1000 /home/node

USER 1000

RUN npm -v && \
    npm install && \
    npm run pretest

FROM node:26.13.0-alpine3.24@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS production

WORKDIR /home/node

COPY --from=builder /home/node/dst/ ./dst/
COPY --from=builder /home/node/node_modules ./node_modules

COPY ./package.json /home/node
COPY ./user.json /home/node
COPY ./configuration.json /home/node
COPY ./nodesets /home/node/nodesets
COPY ./models /home/node/models
COPY ./healthcheck.js /home/node/healthcheck.js

RUN chown -R 1000:1000 /home/node

USER 1000

HEALTHCHECK --interval=30s CMD ["node", "/home/node/healthcheck.js"]

EXPOSE 4840

ENTRYPOINT ["node", "./dst/src/server.js"]
