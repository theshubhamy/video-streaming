# Use official Postgres image as base
FROM postgres:15

# Copy your init.sql to the Docker image's entrypoint folder
COPY up.sql /docker-entrypoint-initdb.d/

# Expose default postgres port

CMD ["postgres"]
