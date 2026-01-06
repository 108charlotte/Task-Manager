
# how to run django commands with python
create image for backend: 
docker build -t backend . 

run a command: 
docker run --rm -v $(pwd):/app backend python manage.py startapp APPNAME or runserver

after to clean up: 
docker rmi backend