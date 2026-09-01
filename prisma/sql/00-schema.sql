USE desarrollo_software_1;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  clave VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS proyectos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(180) NOT NULL,
  fecha_inicio DATE NOT NULL,
  estado VARCHAR(50) NOT NULL,
  responsable VARCHAR(120) NOT NULL,
  monto INT UNSIGNED NOT NULL,
  created_by INT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_proyectos_created_by (created_by),
  CONSTRAINT fk_proyectos_usuario
    FOREIGN KEY (created_by) REFERENCES usuarios (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
