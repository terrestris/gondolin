FROM node:8-alpine

RUN apk add --no-cache --virtual python2
RUN apk add --no-cache dumb-init 

WORKDIR /gondolin

COPY . .

RUN npm install
RUN npm prune --production
RUN mkdir -p log

# Clean up
RUN apk del python2 \
&& rm -rf /var/cache

ENV NODE_ENV production

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
