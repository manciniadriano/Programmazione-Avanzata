CREATE DATABASE prga;
\c prga
CREATE TABLE users(
  email varchar(50) NOT NULL,
  budget REAL NOT NULL,
  ruolo INT NOT NULL
);

CREATE TABLE model(
  namemodel varchar(50) NOT NULL,
  objective varchar(50) NOT NULL,
  subjectTo varchar(50) NOT NULL,
  bounds varchar(50) DEFAULT NULL,
  binaries varchar(50) DEFAULT NULL,
  generals varchar(50) DEFAULT NULL,
  options varchar(50) DEFAULT NULL
);

INSERT INTO users(email, budget, ruolo) VALUES
('user@user.com', 100, 1),
('admin@admin.com', 100, 2);