FROM node:17.4.0

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]