FROM node:17.2
RUN apk add openssl
COPY . /
RUN npm install
EXPOSE 4840/tcp
EXPOSE 5353/udp 
ENTRYPOINT ["npm", "run", "start_lds"]