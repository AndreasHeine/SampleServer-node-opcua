FROM node

COPY . /

RUN npm install -g typescript @types/node
RUN npm install

EXPOSE 4840

ENTRYPOINT ["npm", "run", "start"]