DROP DATABASE IF EXISTS SeqMine;

CREATE DATABASE IF NOT EXISTS SeqMine;

USE SeqMine;

-- Create sequences
-- #####################################################################
CREATE SEQUENCE user_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE roles_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fasta_files_id START WITH 1 INCREMENT BY 1;
-- #####################################################################

-- Create and fetch roles table.
-- #####################################################################
CREATE TABLE IF NOT EXISTS roles (
                                role_id INT(10) PRIMARY KEY,
                                role_name VARCHAR(25) NOT NULL
);

INSERT INTO roles VALUES
    (NEXT VALUE FOR roles_id, "admin"),
    (NEXT VALUE FOR roles_id, "investigator")
;

-- #####################################################################

-- Create and fetch users table.
-- #####################################################################
CREATE TABLE IF NOT EXISTS users (
                                user_id INT(10) PRIMARY KEY,
                                username VARCHAR(25) NOT NULL CHECK(username <> ''),
                                role_id INT(10) NOT NULL CHECK(role_id <> 0),
                                password VARCHAR(25) NOT NULL CHECK(password <> ''),
                                email VARCHAR(30) NOT NULL CHECK(email <> ''),
                                first_name VARCHAR(50) NOT NULL CHECK(first_name <> ''),
                                last_name VARCHAR(60) NOT NULL CHECK(last_name <> ''),
                                registration_date DATE NOT NULL,
                                FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

INSERT INTO users VALUES
    (NEXT VALUE FOR user_id, "admin", 1, "admin", "admin@gmail.com", "Dániel", "Májer", "2023-2-8"),
    (NEXT VALUE FOR user_id, "investigator", 2, "investigator", "investigator@gmail.com","Dániel", "Májer", "2023-2-8"),
    (NEXT VALUE FOR user_id, "user01", 2, "pass01", "lili@gmail.com", "Lili", "Lala", "2022-2-8"),
    (NEXT VALUE FOR user_id, "user02", 2, "pass02", "didi@gmail.com", "Didi", "Dada", "2022-2-10")
;

-- #####################################################################

