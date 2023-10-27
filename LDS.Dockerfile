FROM node:21.0.0-alpine3.17
# hadolint ignore=DL3018
RUN apk --no-cache add \
    openssl=3.0.12-r0

WORKDIR /home/node/discovery

COPY . /home/node/discovery

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "start_lds"]
