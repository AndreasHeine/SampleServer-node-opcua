FROM node:17.2.0

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
