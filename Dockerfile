# Use a lightweight Node.js image as the base
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies required for building
RUN npm install

# Copy application source code
COPY . .

# Remove migrations
RUN rm -rf ./migrations

# Run the build step (use npm or yarn depending on your project)
RUN npm run build

# Use a smaller runtime image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy only necessary files for runtime (e.g., package.json)
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install

# Expose the application port
EXPOSE 5002

# Command to start the application
CMD [ "node", "dist/main.js" ]
