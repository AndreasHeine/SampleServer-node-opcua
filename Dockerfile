FROM node:17.7.1-bullseye

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]