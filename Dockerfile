FROM node:19.8.1-alpine3.17

WORKDIR /home/node/opcua-server

RUN apk --no-cache add openssl=3.1.0-r1
RUN apk --no-cache add python3=3.10.10-r0
RUN apk --no-cache add make=4.3-r1
RUN apk --no-cache add g++=12.2.1_git20220924-r4
RUN apk --no-cache add gcc=12.2.1_git20220924-r4

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]
