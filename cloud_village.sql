create database cloud_village;
use cloud_village;

create table moradores(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    bloco VARCHAR(10) NOT NULL,
    apartamento VARCHAR(10) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    status ENUM('residente', 'proprietário', 'visitante') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table veiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    morador_id INT NOT NULL,
    box VARCHAR(10) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (morador_id) REFERENCES moradores(id) ON DELETE CASCADE
);