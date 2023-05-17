FROM node:20.2.0-alpine3.17
RUN apk add --no-cache openssl=3.0.8-r4

WORKDIR /home/node/discovery

COPY . /home/node/discovery

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "start_lds"]
