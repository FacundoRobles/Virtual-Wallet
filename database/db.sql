-- MY SQL COMMANDS FOR DATABASE INI
CREATE DATABASE virtual_wallet
use virtual_wallet;

CREATE TABLE users(
    id INT(11) AUTO_INCREMENT NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

DESCRIBE users;

-- OPERATIONS TABLE
CREATE TABLE operations(
    id INT(11) NOT NULL,
    title VARCHAR (255) NOT NULL,
    body VARCHAR(255),
    type VARCHAR(20) NOT NULL,
    category VARCHAR(40) NOT NULL,
    value DECIMAL(9,2) NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);
ALTER TABLE operations ADD PRIMARY KEY (id);
ALTER TABLE operations MODIFY id INT(11) NOT NULL AUTO_INCREMENT;