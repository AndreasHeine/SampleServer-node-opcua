FROM node:18.2.0-alpine3.15
RUN apk add --no-cache openssl=1.1.1n-r0

COPY . /

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "start_lds"]