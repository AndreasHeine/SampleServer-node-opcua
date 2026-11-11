FROM node:26.13.1-alpine3.24@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5
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
