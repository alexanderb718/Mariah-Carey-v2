FROM node:24

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

# Start the Bot
CMD ["node", "index.js"]