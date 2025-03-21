# Use Node.js 18 Alpine as a base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose the application port
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
