FROM node:18-alpine

# Add postgresql-client for wait-for-it script
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy wait script first
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set production environment
ENV NODE_ENV=production

# Command to run migrations and start app
CMD ["sh", "-c", "./wait-for-it.sh spookyspot-db && npm install && npm run build && npx sequelize-cli db:seed:undo:all && npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm start"]