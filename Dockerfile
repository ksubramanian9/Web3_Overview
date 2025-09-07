FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node generate_pages.js \
 && echo 'window.RUNNING_IN_DOCKER = true;' > config.js
EXPOSE 8080
CMD ["node", "server.js"]
