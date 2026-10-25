FROM node:24.22.1-alpine3.24@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R 1000:1000 /home/node

USER 1000

RUN npm -v && \
    npm install && \
    npm run pretest

FROM node:24.22.1-alpine3.24@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS production

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
