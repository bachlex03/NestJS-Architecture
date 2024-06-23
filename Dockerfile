###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20.11.1-alpine3.19 as DEVELOPMENT

WORKDIR /usr/src/app

COPY --chown=user ./package*.json .

RUN npm ci

COPY . .

USER node

