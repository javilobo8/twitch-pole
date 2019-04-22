FROM node:8-slim

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --production

COPY . ./

EXPOSE 80
CMD ["npm", "start"]