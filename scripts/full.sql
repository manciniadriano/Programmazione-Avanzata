CREATE DATABASE prga;
\c prga
CREATE TABLE users(
  email varchar(50) NOT NULL,
  budget REAL NOT NULL
);

CREATE TABLE models(
  id SERIAL PRIMARY KEY,
  namemodel varchar(50) NOT NULL,
  objective json NOT NULL,
  subjectTo json NOT NULL,
  bounds json DEFAULT NULL,
  binaries json DEFAULT NULL,
  generals json DEFAULT NULL,
  options json DEFAULT NULL,
  version INTEGER NOT NULL,
  cost NUMERIC,
  creation_date varchar(50) NOT NULL,
  valid boolean
);

-- inserimento di 2 utenti
INSERT INTO users(email, budget) VALUES
('user@user.com', 5),
('nicola@nicola.com', 100);

-- inserimento del primo modello
INSERT INTO models(namemodel,objective,subjectto,binaries,options,version,cost,creation_date,valid) VALUES
('mip_with_binaries',
'{"direction": 1,"name": "obj","vars": [{"name": "x1","coef": -1},{"name": "x2","coef": -2},{"name": "x3","coef": 0.1},{"name": "x4","coef": 3}]}',
'[{"name":"c1","vars":[{"name":"x1","coef":1},{"name":"x2","coef":1}],"bnds":{"type":3,"ub":5,"lb":0}},{"name":"c2","vars":[{"name":"x1","coef":2},{"name":"x2","coef":-1}],"bnds":{"type":2,"ub":0,"lb":0}},{"name":"c3","vars":[{"name":"x1","coef":-1},{"name":"x2","coef":3}],"bnds":{"type":2,"ub":0,"lb":0}},{"name":"c4","vars":[{"name":"x3","coef":1},{"name":"x4","coef":1}],"bnds":{"type":2,"ub":0,"lb":0.5}}]',
'["x3","x4"]',
'{"mipgap":0,"tmlim":1.7976931348623157e+308,"msglev":1,"presol":true,"cb":{"each":1}}',
1,
0.34,
'7/17/2022',
true);

-- inserimento del secondo modello
INSERT INTO models(namemodel,objective,subjectto,bounds,generals,options,version,cost,creation_date,valid) VALUES
('mip',
'{"direction": 2,"name": "obj","vars": [{"name": "x1","coef": 1},{"name": "x2","coef": 2},{"name": "x3","coef": 3},{"name": "x4","coef": 1}]}',
'[{"name":"c1","vars":[{"name":"x1","coef":-1},{"name":"x2","coef":1},{"name":"x3","coef":1},{"name":"x4","coef":10}],"bnds":{"type":3,"ub":20,"lb":0}},{"name":"c2","vars":[{"name":"x1","coef":1},{"name":"x2","coef":-3},{"name":"x3","coef":1}],"bnds":{"type":3,"ub":30,"lb":0}},{"name":"c3","vars":[{"name":"x2","coef":1},{"name":"x4","coef":-3.5}],"bnds":{"type":5,"ub":0,"lb":0}}]',
'[{"name": "x1","type": 4,"ub": 40,"lb": 0},{"name": "x4","type": 4,"ub": 3,"lb": 2}]',
'["x4"]',
'{"mipgap":0,"tmlim":1.7976931348623157e+308,"msglev":1,"presol":true,"cb":{"each":1}}',
1,
0.30,
'7/17/2022',
true);

-- inserimento della prima revisione del primo modello (cambio coefficienti della funzione obiettivo)
INSERT INTO models(namemodel,objective,subjectto,binaries,options,version,cost,creation_date,valid) VALUES
('mip_with_binaries',
'{"direction": 1,"name": "obj","vars": [{"name": "x1","coef": 2},{"name": "x2","coef": 3},{"name": "x3","coef": 4},{"name": "x4","coef": 5}]}',
'[{"name":"c1","vars":[{"name":"x1","coef":1},{"name":"x2","coef":1}],"bnds":{"type":3,"ub":5,"lb":0}},{"name":"c2","vars":[{"name":"x1","coef":2},{"name":"x2","coef":-1}],"bnds":{"type":2,"ub":0,"lb":0}},{"name":"c3","vars":[{"name":"x1","coef":-1},{"name":"x2","coef":3}],"bnds":{"type":2,"ub":0,"lb":0}},{"name":"c4","vars":[{"name":"x3","coef":1},{"name":"x4","coef":1}],"bnds":{"type":2,"ub":0,"lb":0.5}}]',
'["x3","x4"]',
'{"mipgap":0,"tmlim":1.7976931348623157e+308,"msglev":1,"presol":true,"cb":{"each":1}}',
2,
0.34,
'7/17/2022',
true);

-- inserimento della seconda revisione del primo modello (cambio coefficienti della funzione obiettivo)
INSERT INTO models(namemodel,objective,subjectto,binaries,options,version,cost,creation_date,valid) VALUES
('mip_with_binaries',
'{"direction": 1,"name": "obj","vars": [{"name": "x1","coef": 1},{"name": "x2","coef": 2},{"name": "x3","coef": 3},{"name": "x4","coef": 4}]}',
'[{"name":"c1","vars":[{"name":"x1","coef":1},{"name":"x2","coef":1}],"bnds":{"type":3,"ub":5,"lb":0}},{"name":"c2","vars":[{"name":"x1","coef":2},{"name":"x2","coef":-1}],"bnds":{"type":2,"ub":0,"lb":0}},{"name":"c3","vars":[{"name":"x1","coef":-1},{"name":"x2","coef":3}],"bnds":{"type":2,"ub":0,"lb":0}},{"name":"c4","vars":[{"name":"x3","coef":1},{"name":"x4","coef":1}],"bnds":{"type":2,"ub":0,"lb":0.5}}]',
'["x3","x4"]',
'{"mipgap":0,"tmlim":1.7976931348623157e+308,"msglev":1,"presol":true,"cb":{"each":1}}',
3,
0.34,
'7/17/2022',
true);

-- inserimento della prima revisione del secondo modello (cambio coefficienti della funzione obiettivo)
INSERT INTO models(namemodel,objective,subjectto,bounds,generals,options,version,cost,creation_date,valid) VALUES
('mip',
'{"direction": 2,"name": "obj","vars": [{"name": "x1","coef": 2},{"name": "x2","coef": 3},{"name": "x3","coef": 4},{"name": "x4","coef": 5}]}',
'[{"name":"c1","vars":[{"name":"x1","coef":-1},{"name":"x2","coef":1},{"name":"x3","coef":1},{"name":"x4","coef":10}],"bnds":{"type":3,"ub":20,"lb":0}},{"name":"c2","vars":[{"name":"x1","coef":1},{"name":"x2","coef":-3},{"name":"x3","coef":1}],"bnds":{"type":3,"ub":30,"lb":0}},{"name":"c3","vars":[{"name":"x2","coef":1},{"name":"x4","coef":-3.5}],"bnds":{"type":5,"ub":0,"lb":0}}]',
'[{"name": "x1","type": 4,"ub": 40,"lb": 0},{"name": "x4","type": 4,"ub": 3,"lb": 2}]',
'["x4"]',
'{"mipgap":0,"tmlim":1.7976931348623157e+308,"msglev":1,"presol":true,"cb":{"each":1}}',
2,
0.30,
'7/17/2022',
true);

-- inserimento della seconda revisione del secondo modello (cambio coefficienti della funzione obiettivo)
INSERT INTO models(namemodel,objective,subjectto,bounds,generals,options,version,cost,creation_date,valid) VALUES
('mip',
'{"direction": 2,"name": "obj","vars": [{"name": "x1","coef": 3},{"name": "x2","coef": 4},{"name": "x3","coef": 5},{"name": "x4","coef": 6}]}',
'[{"name":"c1","vars":[{"name":"x1","coef":-1},{"name":"x2","coef":1},{"name":"x3","coef":1},{"name":"x4","coef":10}],"bnds":{"type":3,"ub":20,"lb":0}},{"name":"c2","vars":[{"name":"x1","coef":1},{"name":"x2","coef":-3},{"name":"x3","coef":1}],"bnds":{"type":3,"ub":30,"lb":0}},{"name":"c3","vars":[{"name":"x2","coef":1},{"name":"x4","coef":-3.5}],"bnds":{"type":5,"ub":0,"lb":0}}]',
'[{"name": "x1","type": 4,"ub": 40,"lb": 0},{"name": "x4","type": 4,"ub": 3,"lb": 2}]',
'["x4"]',
'{"mipgap":0,"tmlim":1.7976931348623157e+308,"msglev":1,"presol":true,"cb":{"each":1}}',
3,
0.30,
'7/17/2022',
true);