FROM node:18-alpine

RUN apk add --no-cache postgresql-client wget  # Added wget

WORKDIR /app

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

COPY package*.json ./
RUN npm install

COPY . .
ENV NODE_ENV=production

CMD ["sh", "-c", "./wait-for-it.sh spookyspot-db && npm install && npm run build && npx sequelize-cli db:seed:undo:all && npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm start"]