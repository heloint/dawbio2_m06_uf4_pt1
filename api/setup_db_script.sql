DROP DATABASE IF EXISTS SeqMine;

CREATE DATABASE IF NOT EXISTS SeqMine;

USE SeqMine;

-- Create sequences
-- #####################################################################
CREATE SEQUENCE user_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE roles_id START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE fasta_files_id START WITH 1 INCREMENT BY 1;
-- #####################################################################

-- Create and fetch users table.
-- #####################################################################
CREATE TABLE IF NOT EXISTS users (
                                user_id INT(10) PRIMARY KEY,
                                username VARCHAR(25) NOT NULL,
                                role VARCHAR(20) NOT NULL,
                                password VARCHAR(25) NOT NULL,
                                email VARCHAR(30) NOT NULL,
                                first_name VARCHAR(50) NOT NULL,
                                last_name VARCHAR(60) NOT NULL,
                                registration_date DATE NOT NULL
);

INSERT INTO users VALUES
    (NEXT VALUE FOR user_id, "admin", "admin", "admin", "admin@gmail.com", "Dániel", "Májer", "2023-2-8"),
    (NEXT VALUE FOR user_id, "investigator", "investigator", "investigator", "investigator@gmail.com","Dániel", "Májer", "2023-2-8"),
    (NEXT VALUE FOR user_id, "user01", "pass01", "investigator", "lili@gmail.com", "Lili", "Lala", "2022-2-8"),
    (NEXT VALUE FOR user_id, "user02", "pass02", "investigator", "didi@gmail.com", "Didi", "Dada", "2022-2-10")
;

-- #####################################################################
