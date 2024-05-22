CREATE DATABASE vuelos;
DROP DATABASE vuelos;
use vuelos;

CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    documento VARCHAR(11),
    nacionalidad VARCHAR(50)
);

CREATE TABLE vuelo (
    vuelo_id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_referencia VARCHAR(100) NOT NULL UNIQUE,
    fecha_salida DATETIME NOT NULL,
    fecha_regreso DATE,
	personas_totales INT NOT NULL,
    ruta_imagen VARCHAR(255),
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
);

CREATE TABLE destino (
    destino_id INT AUTO_INCREMENT PRIMARY KEY,
    vuelo_id INT NOT NULL,
    tipo_destino ENUM('salida', 'regreso') NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    FOREIGN KEY (vuelo_id) REFERENCES vuelo(vuelo_id) ON DELETE CASCADE
);

CREATE TABLE ubicacion (
	ubicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    pais VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    iniciales VARCHAR(5) NOT NULL,
    foto VARCHAR(250) NOT NULL
)

SELECT * FROM ubicacion;