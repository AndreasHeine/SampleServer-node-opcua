FROM node:19.6.1-alpine3.17

WORKDIR /home/node/opcua-server

RUN apk --no-cache add \
     openssl=3.0.8-r0 \
     python3=3.10.10-r0 \
     make=4.3-r1 \
     g++=12.2.1_git20220924-r4\
     gcc=12.2.1_git20220924-r4

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]
