FROM node:24.22.2-alpine3.24@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R 1000:1000 /home/node

USER 1000

RUN npm -v && \
    npm install && \
    npm run pretest

FROM node:24.22.2-alpine3.24@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS production

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
