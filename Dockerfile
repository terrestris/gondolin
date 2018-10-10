FROM node:8-alpine

RUN apk add --no-cache --virtual python2

RUN apk add --no-cache dumb-init 

WORKDIR /gondolin

COPY package.json package.json

RUN npm install
RUN npm prune --production
RUN mkdir -p log

# Copy files after installation
COPY config config
COPY models models
COPY public public
COPY service service
COPY util util
COPY web web
COPY index.ts index.js
COPY express.ts express.ts
COPY sequelize.ts sequelize.ts

ENV NODE_ENV production

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "index.ts"]