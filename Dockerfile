# ---- Stage 1: Build client (React) ----
FROM node:18-alpine AS client-build

WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# ---- Stage 2: Setup server (Node.js) ----
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy server code
COPY server/ ./server
COPY server.js ./
COPY .env ./

# Copy built frontend files from Stage 1
COPY --from=client-build /client/build ./client/build

# Expose backend port
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
