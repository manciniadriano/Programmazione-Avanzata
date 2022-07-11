CREATE DATABASE prga;
\c prga
CREATE TABLE users(
  email varchar(50) NOT NULL,
  budget INT NOT NULL,
  ruolo INT NOT NULL
);

INSERT INTO users(email, budget, ruolo) VALUES
('user@user.com', 100, 1),
('admin@admin.com', 100, 2);