FROM dgxmyquestacreusdev.azurecr.io/nginxinc/nginx-unprivileged:1.22-alpine

USER root

ARG PROJECT_NAME

COPY ./appointment /usr/share/nginx/html



WORKDIR /usr/share/nginx/html

COPY ./nginx.appointment.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./general-security-headers.conf /etc/nginx/snippets/general-security-headers.conf

ENTRYPOINT envsubst '\$AUTH_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf \ 
    && cat /etc/nginx/conf.d/default.conf \
    && nginx -g 'daemon off;'
