FROM node

COPY . /

RUN npm install -g typescript @types/node @types/bcrypt
RUN npm install

ENTRYPOINT ["npm", "run", "start"]
