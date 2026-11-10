FROM node:26.13.0-alpine3.24@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R 1000:1000 /home/node

USER 1000

RUN npm -v && \
    npm install && \
    npm run pretest

FROM node:26.13.0-alpine3.24@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS production

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
