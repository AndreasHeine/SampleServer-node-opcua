FROM node

COPY . /

RUN npm install -g typescript @types/node
RUN npm install

ENTRYPOINT ["npm", "run", "start"]
