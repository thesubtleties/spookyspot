#!/bin/bash
cd ~/projects/aa-projects/spookyspot

# Pull latest code
git pull

# Build and deploy
docker-compose pull
docker-compose build --no-cache  # Important for your Node.js frontend/backend
docker-compose up -d

# Clean up
docker image prune -f