FROM node:16.17.0-bullseye-slim

WORKDIR /watch-hands/

COPY package.json package-lock.json /watch-hands/

RUN npm ci --silent

COPY . .

USER node

CMD npm run start