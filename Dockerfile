FROM node:8

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm prune --production
RUN mkdir -p log
ENV NODE_ENV production

CMD ["node", "index.js"]
