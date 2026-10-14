FROM node:24.22.0-alpine3.24@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f
# hadolint ignore=DL3018
RUN apk --no-cache add \
    openssl=3.5.9-r0    

WORKDIR /home/node/

COPY . /home/node/

RUN chown -R node:node /home/node/

USER node

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "dev-start_lds"]
