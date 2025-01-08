CREATE TABLE bairro (
	id INTEGER NOT NULL,
	nome VARCHAR(50) NOT NULL,
	rend_med_sm DECIMAL(15,2),
    populacao INTEGER,
	CONSTRAINT pk_bairro PRIMARY KEY (nome)
);

CREATE TABLE cep_bairro (
	id INTEGER AUTO_INCREMENT,
	cep VARCHAR(10) NOT NULL,
	nome VARCHAR(50) NOT NULL,
	CONSTRAINT pk_cep_bairro PRIMARY KEY (id),
	CONSTRAINT fk_cep_bairro_bairro FOREIGN KEY (nome)
		REFERENCES bairro(nome) ON DELETE CASCADE
);

CREATE TABLE caso_covid (
	id INTEGER AUTO_INCREMENT,
	num_not VARCHAR(50) NOT NULL,
	sexo VARCHAR(20),
	racacor VARCHAR(20),
	cep VARCHAR(10),
	dt_nasc VARCHAR(20),
	forma_doenca VARCHAR(50),
	classificacao VARCHAR(50),
	evolucao VARCHAR(50),
	ano INTEGER,
	CONSTRAINT pk_casos_covid PRIMARY KEY (id)
);



LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.0/Uploads/bairro.csv'
INTO TABLE bairro
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, nome, @rend_med_sm, @populacao)
SET
  rend_med_sm = NULLIF(@rend_med_sm, ''),
  populacao = NULLIF(@populacao, '');




LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.0/Uploads/cep_bairro.csv'
INTO TABLE cep_bairro
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(cep, nome);




LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.0/Uploads/caso_covid_part1.csv'
INTO TABLE caso_covid
FIELDS TERMINATED BY ';'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(num_not, sexo, racacor, cep, dt_nasc, forma_doenca, classificacao, evolucao, ano)