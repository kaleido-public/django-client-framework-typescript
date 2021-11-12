FROM node:12
ARG PACKAGE_FILE

COPY ./tests /tests

WORKDIR /tests
RUN npm install
COPY ${PACKAGE_FILE} /${PACKAGE_FILE}
RUN npm install /${PACKAGE_FILE}
