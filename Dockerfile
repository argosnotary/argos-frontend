# Copyright 2020 Rabobank Nederland
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:12.13.1-alpine as build-stage

WORKDIR /app

COPY ./  /app/

RUN npm install 

RUN npm test 

RUN npm run licensecheck

RUN npm run build

FROM nginx:1.17.6 as run-server-stage

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY --from=build-stage /app/docker/config/nginx.conf /etc/nginx/conf.d/default.conf

