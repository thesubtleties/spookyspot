# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Explicitly set production build
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy from the correct Vite output directory
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]