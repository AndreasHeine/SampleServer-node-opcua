FROM node:17.3.1

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
