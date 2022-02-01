FROM node:17.4.0
RUN apk update && \
    apk add --no-cache openssl

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
