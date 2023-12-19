# School System

School System is a web application designed to empower teachers to provide access to learning materials for their students.

## Features

- **User Registration and Authentication:**
  - Students and teachers can register for an account.
  - Secure authentication system for managing user accounts.

- **Create and Design Courses:**
  - Users can create courses.
  - Design courses using HTML to provide a customizable learning experience.

## Getting Started

### Prerequisites

- Node.js and npm: [Download and install Node.js](https://nodejs.org/).
- PostgreSQL: [Download and install PostgreSQL](https://www.postgresql.org/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Eyup3/SchoolSystem.git
   ```

Certainly! Below is a simplified version of the README specifically highlighting the features of the SchoolSystem web application for teachers to give access to learning material:

markdown

# School System

School System is a web application designed to empower teachers to provide access to learning materials for their students.

## Features

- **User Registration and Authentication:**
  - Teachers can register for an account.
  - Secure authentication system for managing teacher accounts.
  - Save session in DB

- **Create and Design Courses:**
  - Teachers can create courses.
  - Design courses using HTML to provide a customizable learning experience.

## Planned Features
  - Edit profile page
  - Edit course page
  - Send error messages to client through express-flash
  - Mock course for creating courses
  - Add File sharing


## Getting Started

### Prerequisites

- Node.js and npm: [Download and install Node.js](https://nodejs.org/).
- PostgreSQL: [Download and install PostgreSQL](https://www.postgresql.org/).

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
