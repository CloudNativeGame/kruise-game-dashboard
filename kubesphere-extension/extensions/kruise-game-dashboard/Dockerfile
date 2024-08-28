# Use the official Nginx image as the base image
FROM nginx:alpine

# Create a directory in the container for your bundle files
RUN mkdir -p /usr/share/nginx/html/dist

# Copy the index.js bundle file to the directory
COPY dist/index.js /usr/share/nginx/html/dist/

# Expose port 80 to the outside world
EXPOSE 80