FROM node:alpine

WORKDIR /app
COPY package*.json ./

RUN apk add --no-cache make gcc g++ python3 && \
npm install && \
npm rebuild bcrypt -build-from-source && \
apk del make gcc g++ python3

COPY ./ ./
RUN npm run build

CMD ["node", "dist/main"]
