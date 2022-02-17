FROM node:17.5.0-bullseye

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]