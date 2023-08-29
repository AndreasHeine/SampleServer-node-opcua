FROM node:20.5.1-alpine3.17

WORKDIR /home/node/opcua-server

# hadolint ignore=DL3018
RUN apk --no-cache add openssl=3.0.10-r0
RUN apk --no-cache add python3=3.11.5-r0
RUN apk --no-cache add make=4.3-r1
RUN apk --no-cache add g++=12.2.1_git20220924-r4
RUN apk --no-cache add gcc=12.2.1_git20220924-r4

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown -R node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]
