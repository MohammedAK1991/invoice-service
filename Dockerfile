# Use an official Node runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Set default values for environment variables
ENV MONGODB_URI=mongodb://mongo:27017/invoicedb
ENV GOOGLE_CLOUD_PROJECT_ID=mediamarket-interview
ENV PUBSUB_TOPIC_NAME=projects/mediamarket-interview/topics/order-events
ENV GOOGLE_CLOUD_KEY_FILE=secrets/google_cloud_pubsub_key.json
ENV PORT=3001

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application
CMD ["npm", "run", "start:prod"]