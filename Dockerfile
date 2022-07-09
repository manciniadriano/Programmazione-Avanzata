FROM node:lts-stretch-slim
#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

#COPY package*.json ./

#USER node
COPY . .
RUN npm install
RUN npm install -g typescript
RUN tsc
CMD [ "node", "index.js" ]
