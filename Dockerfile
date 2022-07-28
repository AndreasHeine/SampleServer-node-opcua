FROM node:18.7.0-alpine3.15

WORKDIR /home/node/opcua-server

RUN apk --no-cache add \
    openssl=1.1.1q-r0 \
    python3=3.9.13-r1 \
    make=4.3-r0 \
    gcc=10.3.1_git20211027-r0 \ 
    g++=10.3.1_git20211027-r0

COPY . /home/node/opcua-server

RUN npm install

EXPOSE 4840

RUN chown node:node /home/node/opcua-server

USER node

ENTRYPOINT ["npm", "run", "start"]