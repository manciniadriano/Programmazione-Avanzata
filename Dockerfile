FROM node:lts-stretch-slim
WORKDIR /home/node/app
COPY . .
RUN npm install
RUN npm install -g typescript
RUN tsc
CMD [ "node", "index.js" ]
