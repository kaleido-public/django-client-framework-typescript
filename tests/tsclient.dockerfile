FROM node:12

COPY . /django-client-framework-typescript
# Must manually install dependencies when npm install from a local dir
# RUN cd /django-client-framework-typescript && npm install
COPY ./tests /tests

WORKDIR /tests
RUN npm install --save /django-client-framework-typescript
RUN npm install
