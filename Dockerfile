FROM node:12.13.1-alpine as build-stage

WORKDIR /app

COPY ./  /app/

RUN npm install 

RUN npm test 

RUN npm run build

FROM nginx:1.17.6 as run-server-stage

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY --from=build-stage /app/docker/config/nginx.conf /etc/nginx/conf.d/default.conf

