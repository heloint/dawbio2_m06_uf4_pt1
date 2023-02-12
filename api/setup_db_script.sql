DROP DATABASE IF EXISTS SeqMine;

CREATE DATABASE IF NOT EXISTS SeqMine;

USE SeqMine;

-- Create sequences
-- #####################################################################
CREATE SEQUENCE user_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE roles_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE sequence_file_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE user_sess_id START WITH 1 INCREMENT BY 1;
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
                                registration_date TIMESTAMP NOT NULL,
                                FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

INSERT INTO users VALUES
    (NEXT VALUE FOR user_id, "admin", 1, "admin", "admin@gmail.com", "Dániel", "Májer", CURRENT_TIMESTAMP()),
    (NEXT VALUE FOR user_id, "investigator", 2, "investigator", "investigator@gmail.com","Dániel", "Májer", CURRENT_TIMESTAMP()),
    (NEXT VALUE FOR user_id, "user01", 2, "pass01", "lili@gmail.com", "Lili", "Lala", CURRENT_TIMESTAMP()),
    (NEXT VALUE FOR user_id, "user02", 2, "pass02", "didi@gmail.com", "Didi", "Dada", CURRENT_TIMESTAMP())
;

-- #####################################################################

-- Create and fetch sequence_files table.
-- #####################################################################
CREATE TABLE IF NOT EXISTS sequence_files(
                                file_id INT(10) PRIMARY KEY,
                                name VARCHAR(25) NOT NULL UNIQUE CHECK(name <> ''),
                                size INT(60) NOT NULL,
                                path TEXT NOT NULL CHECK(path <> ''),
                                gene VARCHAR(25) NOT NULL CHECK(gene <> ''),
                                taxonomy_id INT(10) NOT NULL CHECK(taxonomy_id <> 0),
                                upload_date TIMESTAMP NOT NULL,
                                uploaded_by VARCHAR(25) NOT NULL CHECK(uploaded_by <> ''),
                                CONSTRAINT file_name_unique UNIQUE (name),
                                CONSTRAINT file_path_unique UNIQUE (path)
);

INSERT INTO sequence_files VALUES
    (NEXT VALUE FOR sequence_file_id, "fasta-example.fasta", 100, "./uploads/fasta-example.fasta", "SELL", 9606, CURRENT_TIMESTAMP(), "admin"),
    (NEXT VALUE FOR sequence_file_id, "fastq-example.fastq", 101, "./uploads/fastq-example.fastq", "SELL", 9615, CURRENT_TIMESTAMP(), "investigator")
;

-- #####################################################################

-- Create and fetch user_sessions table.
-- Also, prepare a scheduled event to delete sessions older, than x time.
-- #####################################################################
CREATE TABLE IF NOT EXISTS user_sessions(
                                user_sess_id INT(50) PRIMARY KEY,
                                user_id INT(10) NOT NULL CHECK(user_id <> 0),
                                token VARCHAR(50) NOT NULL CHECK(token <> ''),
                                timestamp TIME NOT NULL,
                                FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- #####################################################################

