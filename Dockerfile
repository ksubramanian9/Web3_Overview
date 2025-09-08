FROM node:18-alpine
WORKDIR /app
ENV OLLAMA_MODEL=llama3.2
COPY package*.json ./
RUN npm install
COPY . .
RUN node generate_pages.js
EXPOSE 8080
CMD ["node", "server.js"]
