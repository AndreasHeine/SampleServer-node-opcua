FROM node:17.6.0-bullseye

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]