FROM node:12-stretch

WORKDIR /app
COPY . /app

RUN yarn
