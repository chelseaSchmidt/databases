CREATE DATABASE chat;

USE chat;

/*CREATE USERS TABLE*/

CREATE TABLE messages (
  /* Describe your table here.*/
  username VARCHAR(255) NOT NULL,
  objectId INT NOT NULL AUTO_INCREMENT,
  text VARCHAR(255) NOT NULL,
  createdAt DATE,
  roomname VARCHAR(255) NOT NULL,
  updatedAt DATE,
  FOREIGN KEY (username) REFERENCES users(username)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

