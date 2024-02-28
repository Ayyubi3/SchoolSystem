# School System

School System is a web application designed to empower teachers to provide access to learning materials for their students.

## Features

- **User Registration and Authentication:**
  - Secure login and sign up for teachers and students through passportjs. 
  - Profile page with easy way to delete account.
  - Session data and user data is safely stored in PostgresSQL database.

- **Create and Design Courses:**
  - Create and design courses with Markdown.
  - Add links to other ressources.
  - Edit or delete course if user is the creator.
  - join or leave course if you are a normal user so the course is listed in /dashboard.
  - (in the future) add links to custom files saved on the server.
 

## Planned Features 
- File sharing

- 
## Getting Started

### Prerequisites

- Node.js and npm: [Download and install Node.js](https://nodejs.org/).
- Docker compose

Need to update bc of rewrite in other branch

```
git clone https://github.com/Eyup3/SchoolSystem.git
cd SchoolSystem
sudo npm i
sudo docker compose up -d database
sudo npm run dev

```
  
