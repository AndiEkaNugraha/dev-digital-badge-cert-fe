# FROM node:22-alpine

# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Copy all necessary packages
# COPY packages ./packages

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .
# # ENV NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
# # # Build the Next.js application
# RUN npm run build
   
# # # Expose port 3000
# EXPOSE 3000

# # # Start the application
# CMD ["npm", "start"]

# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application (including components, styles, etc.)
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/components ./components
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/.env.local ./.env.local
# Tambahkan folder lain yang diperlukan, jika ada

# Install only production dependencies
RUN npm install --production

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
