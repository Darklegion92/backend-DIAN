# Solución: Error de Campo 'username' en Base de Datos

## 🚨 Problema
```
QueryFailedError: Field 'username' doesn't have a default value
```

## 🔍 Causa
La tabla `users_soltec` en la base de datos no tiene la estructura correcta esperada por la entidad User de TypeORM.

## ✅ Soluciones Implementadas

### 1. Servicio de Migración Automática
Se creó `DatabaseMigrationService` que:
- ✅ Verifica si la tabla `users_soltec` existe
- ✅ Crea la tabla con estructura correcta si no existe
- ✅ Agrega columnas faltantes si la tabla existe pero está incompleta

### 2. Mejoras en InitService
- ✅ Logging detallado para diagnóstico
- ✅ Manejo de errores robusto
- ✅ Verificación de estructura antes de crear usuarios

### 3. Estructura Correcta de la Tabla

```sql
CREATE TABLE users_soltec (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER',
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🛠️ Solución Manual (Si es necesario)

Si el problema persiste, ejecutar manualmente en MySQL:

### Opción A: Recrear tabla completa
```sql
-- Hacer backup si hay datos importantes
DROP TABLE IF EXISTS users_soltec;

-- Crear tabla con estructura correcta
CREATE TABLE users_soltec (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER',
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Opción B: Agregar columnas faltantes
```sql
-- Verificar estructura actual
DESCRIBE users_soltec;

-- Agregar columnas que falten
ALTER TABLE users_soltec ADD COLUMN username VARCHAR(255) NOT NULL UNIQUE AFTER id;
ALTER TABLE users_soltec ADD COLUMN name VARCHAR(255) NOT NULL;
ALTER TABLE users_soltec ADD COLUMN role ENUM('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER';
```

## 🚀 Verificación

### Logs a observar:
```
[DatabaseMigrationService] Checking user table structure...
[DatabaseMigrationService] Table users_soltec exists, checking columns...
[DatabaseMigrationService] Current table structure: [...]
[DatabaseMigrationService] User table verification completed
[InitService] Checking if admin user exists...
[InitService] Creating default admin user...
[InitService] Default admin user created successfully
```

### Verificar en base de datos:
```sql
-- Verificar que la tabla existe con estructura correcta
DESCRIBE users_soltec;

-- Verificar que el usuario admin se creó
SELECT id, username, email, role, name FROM users_soltec WHERE role = 'ADMIN';
```

## 🔧 Configuración Aplicada

### main.ts - ValidationPipe Global
```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

### typeorm.config.ts - Configuración de BD
```typescript
{
  synchronize: false,  // Deshabilitado para control manual
  autoLoadEntities: true,
  logging: configService.get('NODE_ENV') === 'development',
}
```

## 📋 Orden de Ejecución

1. **Inicio de aplicación** → `bootstrap()`
2. **Módulo Auth** → `AuthModule.onModuleInit()`
3. **InitService** → `onModuleInit()`
4. **DatabaseMigrationService** → `checkAndFixUserTable()`
5. **Verificación/Creación** de tabla y columnas
6. **Creación** del usuario admin por defecto

## 🐛 Troubleshooting

### Si el error persiste:

1. **Verificar conexión a BD:**
```bash
npm run start:dev
# Observar logs de conexión
```

2. **Revisar variables de entorno:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=dian_database
```

3. **Verificar permisos de MySQL:**
```sql
GRANT ALL PRIVILEGES ON dian_database.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Limpiar y reinstalar dependencias:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
npm run start:dev
```

---

**Nota**: El sistema ahora debería crear automáticamente la estructura correcta de la tabla y el usuario admin por defecto. 