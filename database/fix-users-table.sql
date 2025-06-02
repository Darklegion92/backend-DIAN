-- Script para corregir la tabla users_soltec
-- Ejecutar este script en MySQL si el error persiste

-- 1. Verificar estructura actual
SELECT 'Estructura actual de la tabla:' AS info;
DESCRIBE users_soltec;

-- 2. Verificar si existen usuarios
SELECT 'Usuarios existentes:' AS info;
SELECT COUNT(*) as total_users FROM users_soltec;

-- 3. Opción A: Si la tabla está vacía, recrearla completamente
-- DROP TABLE IF EXISTS users_soltec;

-- CREATE TABLE users_soltec (
--   id VARCHAR(36) NOT NULL PRIMARY KEY,
--   username VARCHAR(255) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL UNIQUE,
--   role ENUM('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER',
--   name VARCHAR(255) NOT NULL,
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- 4. Opción B: Si la tabla tiene datos, agregar columnas faltantes

-- Verificar si falta la columna username
SET @username_exists = (
  SELECT COUNT(*) 
  FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users_soltec' 
  AND COLUMN_NAME = 'username'
);

-- Agregar username si no existe
SET @sql = IF(@username_exists = 0, 
  'ALTER TABLE users_soltec ADD COLUMN username VARCHAR(255) NOT NULL UNIQUE AFTER id;', 
  'SELECT "Column username already exists" AS message;'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si falta la columna name
SET @name_exists = (
  SELECT COUNT(*) 
  FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users_soltec' 
  AND COLUMN_NAME = 'name'
);

-- Agregar name si no existe
SET @sql = IF(@name_exists = 0, 
  'ALTER TABLE users_soltec ADD COLUMN name VARCHAR(255) NOT NULL;', 
  'SELECT "Column name already exists" AS message;'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar si falta la columna role
SET @role_exists = (
  SELECT COUNT(*) 
  FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'users_soltec' 
  AND COLUMN_NAME = 'role'
);

-- Agregar role si no existe
SET @sql = IF(@role_exists = 0, 
  'ALTER TABLE users_soltec ADD COLUMN role ENUM(''ADMIN'', ''DEALER'', ''USER'') NOT NULL DEFAULT ''USER'';', 
  'SELECT "Column role already exists" AS message;'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Verificar estructura final
SELECT 'Estructura final de la tabla:' AS info;
DESCRIBE users_soltec;

-- 6. Crear usuario admin si no existe
INSERT IGNORE INTO users_soltec (id, username, email, password, name, role, createdAt, updatedAt)
VALUES (
  UUID(),
  'admin',
  'admin@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: admin123
  'Administrador',
  'ADMIN',
  NOW(),
  NOW()
);

SELECT 'Usuario admin creado o ya existe' AS info; 