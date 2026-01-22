# Task Manager
A full-stack application built with React, Django, and PostgreSQL, containerized with Docker (through Docker Compose), and ultimately hosted on an AWS EC2 instance. This project was created during my internship with the Administrative Office of the Courts's (AOC) development team to gain a better understanding of containerization and hosting theory through practice. It also inspired my [tutorial](https://108charlotte.github.io/Full-Stack-with-Docker-and-AWS-Tutorial/) (code [here](https://github.com/108charlotte/Full-Stack-with-Docker-and-AWS-Tutorial)), which instructs users unfamiliar with Docker and AWS on how to build this project, teaching them about how those technologies work and providing hands-on experience. 

## Tech Stack: 
- Frontend: React
- Backend: Django
- Database: PostgreSQL
- Containerization: Docker
- Hosting: AWS

## About
The project is structured into two separate folders: a frontend folder, which contains the code and Dockerfile for the Django container (the Dockerfile also contains installations for the Postgres database), and a backend folder, which contains the code and Dockefile for the React container. There is a Docker Compose file at the repository root which spins up both containers along with the PostgreSQL database. There are three Docker containers in total: one frontend, one backend, and one database. Then, I deployed everything on an Amazon EC2 instance, which I detailed how to do in my tutorial. 

## App Functionality
- User Authentication and Registration: New users can create accounts, and existing users can log in. This requires communication from the frontend to the backend, then from the backend to the database, and finally back to the frontend to verify a user's credentials or create a new user entry. Only one user can be created for each username, which is what allows by-username task search logic to work
- See Tasks for Any Existing User: Once authenticated, users can enter the username of any other user to see that user's tasks
- Permissions for Adding and Removing Tasks: Users can see their own tasks, add new tasks, and delete tasks by clicking on them. There are measures in place both on the frontend and on the backend to ensure a user can't add or remove tasks which aren't associated with their own username

**Note**: If you want to run this application locally, you will need to have Docker and Docker Compose installed. There are also environmental variables which I have stored in a local .env file, but I have provided a sample .env at [.env.example](https://github.com/108charlotte/Task-Manager/blob/main/.env.example) which you can rename to .env and populate with secure values
