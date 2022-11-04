FROM node:19.0.0-alpine3.16
RUN apk add --no-cache openssl=1.1.1s-r0

WORKDIR /home/node/discovery

COPY . /home/node/discovery

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "start_lds"]
