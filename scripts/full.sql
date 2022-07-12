CREATE DATABASE prga;
\c prga
CREATE TABLE users(
  email varchar(50) NOT NULL,
  budget REAL NOT NULL,
  ruolo INT NOT NULL
);

CREATE TABLE models(
  id SERIAL PRIMARY KEY,
  namemodel varchar(50) NOT NULL,
  objective json NOT NULL,
  subjectTo json NOT NULL,
  bounds json DEFAULT NULL,
  binaries varchar(50)[] DEFAULT NULL,
  generals varchar(50)[] DEFAULT NULL,
  options json DEFAULT NULL,
  versione INTEGER NOT NULL,
  cost NUMERIC,
  creation_date varchar(50) NOT NULL
);

INSERT INTO users(email, budget, ruolo) VALUES
('user@user.com', 5, 1),
('admin@admin.com', 100, 2);