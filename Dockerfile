FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g http-server \
 && node generate_pages.js \
 && echo 'window.RUNNING_IN_DOCKER = true;' > config.js
EXPOSE 8080
CMD ["http-server", ".", "-p", "8080"]
