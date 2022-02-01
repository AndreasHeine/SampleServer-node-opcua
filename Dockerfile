FROM node:alpine

COPY . /

RUN npm install
RUN apk add openssl

ENTRYPOINT ["npm", "run", "start"]
