FROM node:21.4.0 AS builder

RUN node -v

WORKDIR /home/node
     
COPY . /home/node

RUN chown -R node:node /home/node

USER node

RUN npm -v
RUN npm install

RUN npm run pretest

FROM node:21.4.0-alpine3.17 AS production

USER node

WORKDIR /home/node

COPY --from=builder /home/node/dst/ ./dst/
COPY --from=builder /home/node/node_modules ./node_modules

COPY ./package.json /home/node
COPY ./user.json /home/node
COPY ./configuration.json /home/node
COPY ./nodesets /home/node/nodesets
COPY ./models /home/node/models


EXPOSE 4840

ENTRYPOINT ["node", "./dst/server.js"]

