
# how to run django commands with python
create image for backend: 
docker build -t backend . 

run a command: 
docker run --rm -v $(pwd):/app backend python manage.py startapp APPNAME or runserver

docker compose run --rm backend sh -c "python manage.py makemigrations"

after to clean up: 
docker rmi backend

manage.py loaddata 