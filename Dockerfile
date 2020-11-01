# Copyright 2020 Argos Notary Coöperatie UA
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

FROM nginx:1.19.3-alpine

COPY build/ /usr/share/nginx/html

RUN mkdir /image_config

COPY docker/config/nginx.conf.template /image_config/nginx.conf.template

COPY docker/run.sh /run.sh
RUN chmod +x /run.sh

ARG VERSION

ENV ARGOS_VERSION ${VERSION}

ENTRYPOINT ["/run.sh"]
