FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN node generate_pages.js
EXPOSE 8080
CMD ["node", "server.js"]
