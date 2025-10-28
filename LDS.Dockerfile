FROM node:24.10.0-alpine3.22
# hadolint ignore=DL3018
RUN apk --no-cache add \
    openssl=3.5.4-r0

WORKDIR /home/node/

COPY . /home/node/

RUN chown -R node:node /home/node/

USER node

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "dev-start_lds"]
