# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first to leverage layer caching
COPY package.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npx ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built Angular app
# Angular 17 application builder outputs to dist/<project>/browser
COPY --from=build /app/dist/booking-frontend/browser /usr/share/nginx/html

EXPOSE 80

# nginx:alpine uses envsubst via the docker-entrypoint.sh template mechanism.
# Set BACKEND_URL at runtime, e.g.:
#   docker run -e BACKEND_URL=https://booking-backend-xxx-uc.a.run.app ...
CMD ["nginx", "-g", "daemon off;"]
