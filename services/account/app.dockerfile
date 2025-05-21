FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port (assuming your app runs on 4000)
EXPOSE 4000

# Start the built server
CMD ["node", "dist/server.js"]
