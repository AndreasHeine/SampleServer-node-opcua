FROM node:17.8.0-alpine3.15

RUN apk --no-cache add \
    openssl=1.1.1n-r0 \
    python3=3.9.7-r4 \
    make=4.3-r0 \
    gcc=10.3.1_git20211027-r0 \ 
    g++=10.3.1_git20211027-r0

COPY . /

RUN npm install

EXPOSE 4840

ENTRYPOINT ["npm", "run", "start"]