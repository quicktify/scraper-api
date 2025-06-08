FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chown -R node:node /usr/src/app

USER node

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]