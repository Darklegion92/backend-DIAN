# Configuración de Arranque de Base de Datos

## Descripción
La aplicación está configurada para crear únicamente la tabla `users_soltec` al arrancar, evitando la creación automática de todas las demás tablas.

## Configuración Actual

### TypeORM Config (`src/config/typeorm.config.ts`)
- **Entidades incluidas**: Solo `User` entity
- **Tabla creada**: `users_soltec`
- **Synchronize**: `true` (solo para users_soltec)
- **AutoLoadEntities**: `false` (evita carga automática)

### Comportamiento al Arrancar
1. Se conecta a la base de datos MySQL
2. Crea únicamente la tabla `users_soltec` si no existe
3. No crea ninguna otra tabla automáticamente

### Otras Entidades
Las demás entidades se cargan bajo demanda cuando se importan sus respectivos módulos:

- **ConfigModule**: Entidades relacionadas con compañías, certificados, países, etc.
- **DocumentModule**: Entidades de documentos
- **AuthModule**: Solo User (ya cargada en configuración principal)

## Estructura de la Tabla users_soltec

```sql
CREATE TABLE users_soltec (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'DEALER', 'USER') DEFAULT 'USER',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Ventajas de esta Configuración

1. **Arranque Rápido**: Solo se crea una tabla al iniciar
2. **Flexibilidad**: Las demás tablas se crean cuando se necesitan
3. **Desarrollo Incremental**: Permite activar módulos según sea necesario
4. **Menor Complejidad**: Evita dependencias circulares en el arranque

## Activar Módulos Adicionales

Para que se creen las tablas de otros módulos, simplemente importa el módulo correspondiente en `app.module.ts`:

```typescript
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,        // ✅ Ya importado - crea users_soltec
    ConfigModule,      // ✅ Ya importado - crea tablas de config cuando se usa
    // DocumentModule, // 🔄 Importar para crear tablas de documentos
    // PayrollModule,  // 🔄 Importar para crear tablas de nómina
  ],
  // ...
})
```

## Variables de Entorno Requeridas

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Verificación

Para verificar que solo se crea la tabla `users_soltec`:

1. Borra la base de datos actual
2. Arranca la aplicación
3. Verifica que solo existe la tabla `users_soltec`

```sql
SHOW TABLES;
-- Debería mostrar solo: users_soltec
``` 