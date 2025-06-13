-- Agregar campo soltec_user_id a la tabla companies
ALTER TABLE companies
ADD COLUMN `soltec_user_id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_unicode_ci';

-- Agregar índice para mejorar el rendimiento de búsquedas
ALTER TABLE companies
ADD INDEX `idx_soltec_user_id` (`soltec_user_id`); 