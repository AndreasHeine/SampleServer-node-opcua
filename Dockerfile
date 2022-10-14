FROM node:18.11.0-alpine3.16

WORKDIR /home/node/opcua-server

RUN apk --no-cache add \
    openssl=1.1.1q-r0 \
    python3=3.10.5-r0 \
    make=4.3-r0 \
    gcc=11.2.1_git20220219-r2 \ 
    g++=11.2.1_git20220219-r2

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]