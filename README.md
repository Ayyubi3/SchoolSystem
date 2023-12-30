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
- PostgreSQL: [Download and install PostgreSQL](https://www.postgresql.org/).

### Used technologies
- https://www.npmjs.com/package/express
- https://www.npmjs.com/package/passport
- https://www.npmjs.com/package/ejs
- https://www.npmjs.com/package/socket.io
- https://www.npmjs.com/package/pg
  
### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Eyup3/SchoolSystem.git
   ```

1. Change into the project directory:

    ```bash
    cd SchoolSystem
    ```


1. Install dependencies:

    ```bash
    npm i
    ```


1. Set up the database:
    ```bash
    psql -U <username> -d <dbname> -a -f path/to/Schema.sql
    ```

1. Set up .env file

    Create .env file with the following data

    ```
    SERVER_PORT=
    SESSION_SECRET=67fda908f8790afa987 #example key

    DBUSER=
    DBHOST=
    DBDATABASE=
    DBPASSWORD=
    DBPORT=


    ENV=DEV #DEV/PROD
    ```


1. Run the application:

    ```bash
    npm run dev
    ```
