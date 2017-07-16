FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app

# Bundle app source
COPY . /usr/src/app

WORKDIR /usr/src/app/exmples
RUN npm install

EXPOSE 11616

ENV NODE_ENV production
CMD [ "node", "examples/server.js" ]