FROM node:20.2.0-alpine3.17

WORKDIR /home/node/opcua-server
# hadolint ignore=DL3018
RUN apk --no-cache add \
     openssl~3 \
     python3~3.10 \
     make=4.3-r1 \
     g++=12.2.1_git20220924-r4 \
     gcc=12.2.1_git20220924-r4

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown -R node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]
