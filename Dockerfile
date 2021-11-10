FROM node:17.1

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
