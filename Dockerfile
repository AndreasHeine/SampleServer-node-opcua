FROM node:16.11

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
