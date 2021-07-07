FROM node

COPY . /django-client-framework
WORKDIR /django-client-framework
RUN npm install

COPY ./tests /tests

WORKDIR /tests
RUN npm install --also=dev
RUN npm install /django-client-framework
RUN npm run build

CMD npm run test
