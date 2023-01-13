# base image
FROM node:12.8.1-alpine

RUN apk add --update --no-cache \
    python \
    make \
    g++

# Set the working directory to /app
WORKDIR /usr/src/app
COPY . /usr/src/app
ENV NODE_ENV=production
ENV DEPLOY_ENV=non-prod
ENV VAULT_AWS_AUTH_ROLE=aerup-developer-faragate-task-execution-role-np
ENV VAULT_PATH=secret/aerup/non-prod
ENV VAULT_URL=https://vault.agro.services
ENV VAULT_API_VERSION=v1
ENV PORT=80
# Make port 80 available to the world outside this container
EXPOSE 80

# Run start when the container launches
CMD [ "node", "server.js" ]