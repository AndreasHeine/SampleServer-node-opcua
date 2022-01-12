FROM node:17.3.1-alpine3.14
RUN apk add --no-cache openssl=1.1.1l-r0

COPY . /

RUN npm install

EXPOSE 4840/tcp
EXPOSE 5353/udp 

ENTRYPOINT ["npm", "run", "start_lds"]