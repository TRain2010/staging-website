# Static site served by nginx as a non-root user on port 8080.
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY *.html /usr/share/nginx/html/
COPY favicon.svg robots.txt sitemap.xml /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY fonts/ /usr/share/nginx/html/fonts/
COPY js/ /usr/share/nginx/html/js/
COPY images/ /usr/share/nginx/html/images/
COPY media/ /usr/share/nginx/html/media/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx:alpine ships an unprivileged "nginx" user (uid 101); reuse it rather
# than creating another, and point the pid file somewhere writable.
RUN sed -i 's|^pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf && \
    chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx && \
    chmod -R 755 /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
