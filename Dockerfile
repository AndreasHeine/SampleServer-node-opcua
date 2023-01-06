FROM node:19.4.0-alpine3.16

WORKDIR /home/node/opcua-server

RUN apk --no-cache add openssl=1.1.1s-r0 
RUN apk --no-cache add python3=3.10.9-r0
RUN apk --no-cache add make=4.3-r0
RUN apk --no-cache add g++=11.2.1_git20220219-r2
RUN apk --no-cache add gcc=11.2.1_git20220219-r2

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]
