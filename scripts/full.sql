CREATE DATABASE prga;
\c prga
CREATE TABLE users(
  username varchar(50) NOT NULL,
  budget INT NOT NULL,
  ruolo INT NOT NULL
);

INSERT INTO users(username, budget, ruolo) VALUES
('user_user', 100, 1),
('admin_admin', 100, 2);