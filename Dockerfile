# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the default Vite port (5173) and HMR port (if needed)
EXPOSE 5173 24678

# Set environment variables for development
ENV NODE_ENV=development

# Start Vite in dev mode with host binding
CMD ["npm", "run", "dev", "--", "--host"]
