FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn typeorm migration:run

EXPOSE 3000

CMD ["node", "main.js"]
