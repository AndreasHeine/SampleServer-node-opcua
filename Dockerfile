FROM node:17.4.0-bullseye

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]