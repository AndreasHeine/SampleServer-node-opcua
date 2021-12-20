FROM node:17.3.0

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
