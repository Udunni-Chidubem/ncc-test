# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN npm install
RUN npm install -g nodemon
RUN npm install handlebars-paginate
RUN npm install helmet
# Run the application as a non-root user.
# USER root node

# Copy the rest of the source files into the image.
COPY . .
RUN mkdir logs 

ENV ACCESS_PORT 5200

# Expose the port that the application listens on.
EXPOSE 5200

# Run the application.
CMD [ "npm", "run", "start" ]