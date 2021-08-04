FROM python:3
ARG DCF_BRANCH
ARG TEST_SERVER_BRANCH
ENV PYTHONUNBUFFERED=1
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

RUN git clone https://github.com/kaleido-public/dcf-clients-test-server.git
WORKDIR /dcf-clients-test-server
RUN git checkout ${TEST_SERVER_BRANCH}

RUN pip install -r requirements.txt
RUN pip install git+https://github.com/kaleido-public/django-client-framework.git#${DCF_BRANCH}
RUN python manage.py makemigrations
RUN python manage.py migrate

CMD python manage.py runserver 0.0.0.0:8000
