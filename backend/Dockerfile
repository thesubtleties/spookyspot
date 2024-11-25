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

# Create schema and run migrations/seeds with reset option
CMD ["sh", "-c", "\
    until pg_isready -h spookyspot-db -U ${DB_USER}; do \
        echo 'Waiting for database...'; \
        sleep 2; \
    done; \
    PGPASSWORD=${DB_PASSWORD} psql -h spookyspot-db -U ${DB_USER} -d spookyspot -c 'CREATE SCHEMA IF NOT EXISTS \"airBnbSchema\";' && \
    if [ \"$RESET_DB\" = \"true\" ]; then \
        echo 'Resetting database...' && \
        npx sequelize-cli db:seed:undo:all && \
        npx sequelize-cli db:migrate:undo:all && \
        npx sequelize-cli db:migrate && \
        npx sequelize-cli db:seed:all; \
    else \
        echo 'Running normal migrations...' && \
        npx sequelize-cli db:migrate && \
        npx sequelize-cli db:seed:all; \
    fi && \
    npm start"]