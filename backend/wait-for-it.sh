#!/bin/sh
# wait-for-it.sh

set -e

# Default timeout of 30 seconds
TIMEOUT=30
QUIET=0

host="spookyspot-db"
echo "Waiting for PostgreSQL at host: $host"

# Add timeout to prevent infinite wait
end_time=$(($(date +%s) + TIMEOUT))

until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "spookyspot" -c '\q'; do
    now=$(date +%s)
    if [ $now -gt $end_time ]; then
        echo "Timeout waiting for PostgreSQL to start"
        exit 1
    fi
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
done

echo "PostgreSQL is up - executing command"
exec "$@"