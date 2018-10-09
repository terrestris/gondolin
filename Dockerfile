FROM node:8

WORKDIR /usr/src/app

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
COPY index.js index.js
COPY express.js express.js
COPY sequelize.js sequelize.js

ENV NODE_ENV production

CMD ["node", "index.js"]