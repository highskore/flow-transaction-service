FROM node:18.13.0

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

CMD [ "node", "./dist/index.js" ]
