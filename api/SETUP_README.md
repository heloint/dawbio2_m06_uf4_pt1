# M06 UF4 Pt1

## How to setup?

1. Make sure that MariaDB, NPM,  is installed on your machine.
2. With the following command use the "setup-db-script.sql" to create your
   (our) database:
    - mariadb -u <username> -p<password> < <path-to-the-script>/setup-db-script.sql

3. Install the requiered packages to be able to initialize the node server for
your backend.
    - chmod +x setup.sh ; ./setup.sh

    * If the "package.json" is available, then from the app root dir. you can install the dependencies with
    "npm install".

4. Enter to the api directory and write: npm start to initialize the API.

---
