FROM node:17.4.0
RUN apk add --no-cache openssl=1.1.1l-r0

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
