FROM node:18-alpine

# Install PostgreSQL client and wget for healthchecks
RUN apk add --no-cache postgresql-client wget

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Set production environment
ENV NODE_ENV=production

# Create schema, then run migrations and start
CMD ["sh", "-c", "until pg_isready -h spookyspot-db -U ${DB_USER}; do echo 'Waiting for database...'; sleep 2; done; \
    PGPASSWORD=${DB_PASSWORD} psql -h spookyspot-db -U ${DB_USER} -d spookyspot -c 'CREATE SCHEMA IF NOT EXISTS \"airBnbSchema\";' && \
    npm install && \
    npx sequelize-cli db:migrate && \
    npx sequelize-cli db:seed:all && \
    npm start"]