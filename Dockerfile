FROM node:17.2

COPY . /

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
