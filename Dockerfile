FROM node:14-alpine
WORKDIR /app
RUN apk update && apk add git ca-certificates

COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "index.js"]
