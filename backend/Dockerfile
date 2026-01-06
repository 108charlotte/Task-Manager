# alpine too small for this django use case
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# this is primarily from a tutorial but what its doing is using atp (which stands for advanced package management) to install the posgresql client and 
# libpq-dev and build-essential which helps install it. it also installs requirements.txt, then removes libpq-dev and build-essential since they're not needed, 
# then makes sure everything is fully deleted and removed from the cache with autoremove and rm
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential postgresql-client libpq-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get remove -y build-essential libpq-dev && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:4000"]