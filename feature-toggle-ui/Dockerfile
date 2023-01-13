# base image
FROM node:12.8.1-alpine

RUN apk add --update --no-cache \
    python \
    make \
    g++

WORKDIR /usr/src/app
COPY . /usr/src/app/
COPY ./dist /usr/src/app/ 

ENV NODE_ENV=production
ENV PORT=80

CMD [ "/usr/local/bin/node", "./index.js" ]

EXPOSE 80
