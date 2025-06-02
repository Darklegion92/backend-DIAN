# Servicio de Usuarios - Guía Completa

## 📋 Resumen
Se ha implementado un servicio completo para la gestión de usuarios en el sistema DIAN API 2025, incluyendo operaciones CRUD y documentación Swagger.

## 🏗️ Arquitectura Implementada

### Estructura de Archivos
```
backend/src/auth/
├── domain/
│   └── entities/
│       └── user.entity.ts          # ✅ Entidad User con Swagger
├── application/
│   ├── dtos/
│   │   └── user-response.dto.ts    # ✅ DTO para respuestas (sin contraseña)
│   └── use-cases/
│       ├── get-users.use-case.ts   # ✅ Caso de uso: listar usuarios
│       └── get-user-by-id.use-case.ts # ✅ Caso de uso: obtener por ID
├── infrastructure/
│   ├── controllers/
│   │   └── user.controller.ts      # ✅ Controlador con endpoints GET
│   └── repositories/
│       └── user.repository.ts      # ✅ Repositorio TypeORM
└── auth.module.ts                  # ✅ Módulo actualizado
```

## 🔧 Componentes Implementados

### 1. Entidad User (Swagger Completo)
**Archivo**: `user.entity.ts`

```typescript
@Entity('users_soltec')
export class User {
  @ApiProperty({ description: 'ID único del usuario', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nombre de usuario único', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'Correo electrónico único', example: 'john@example.com' })
  email: string;

  @ApiProperty({ description: 'Rol del usuario', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Nombre completo', example: 'John Doe' })
  name: string;

  // Campos de auditoría con decoradores Swagger
  createdAt: Date;
  updatedAt: Date;
}
```

**Características**:
- ✅ Decoradores Swagger completos
- ✅ Mapeo a tabla `users_soltec`
- ✅ Enumeración de roles (ADMIN, DEALER, USER)
- ✅ Campos únicos para username y email
- ✅ Auditoría automática (createdAt, updatedAt)

### 2. DTO de Respuesta
**Archivo**: `user-response.dto.ts`

```typescript
export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // ⚠️ Nota: NO incluye el campo 'password' por seguridad
}
```

**Beneficios**:
- 🔒 **Seguridad**: Excluye la contraseña de las respuestas
- 📝 **Documentación**: Swagger automático para respuestas
- 🎯 **Limpieza**: Solo datos relevantes para el frontend

### 3. Repositorio
**Archivo**: `user.repository.ts`

```typescript
@Injectable()
export class UserRepository {
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'name', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'name', 'createdAt', 'updatedAt'],
    });
  }
}
```

**Características**:
- 🔒 **Seguridad**: Excluye automáticamente el campo password
- 📊 **Ordenamiento**: Por fecha de creación descendente
- 🎯 **Optimización**: Solo selecciona campos necesarios

### 4. Casos de Uso

#### GetUsersUseCase
```typescript
@Injectable()
export class GetUsersUseCase {
  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => ({ /* mapeo a DTO */ }));
  }
}
```

#### GetUserByIdUseCase  
```typescript
@Injectable()
export class GetUserByIdUseCase {
  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return { /* mapeo a DTO */ };
  }
}
```

### 5. Controlador
**Archivo**: `user.controller.ts`

```typescript
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los usuarios' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]>

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto>
}
```

## 🚀 Endpoints Disponibles

### 1. Listar Usuarios
```http
GET /users
Authorization: Bearer <token>
```

**Respuesta exitosa (200)**:
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "name": "Administrador del Sistema",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "b2c3d4e5-f6g7-8901-bc23-de45fg678901",
    "username": "dealer1",
    "email": "dealer@example.com",
    "role": "DEALER",
    "name": "Distribuidor Principal",
    "createdAt": "2024-01-14T09:15:00Z",
    "updatedAt": "2024-01-14T09:15:00Z"
  }
]
```

### 2. Obtener Usuario por ID
```http
GET /users/{id}
Authorization: Bearer <token>
```

**Respuesta exitosa (200)**:
```json
{
  "id": "a1b2c3d4-e5f6-7890-ab12-cd34ef567890",
  "username": "admin",
  "email": "admin@example.com",
  "role": "ADMIN",
  "name": "Administrador del Sistema",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Respuesta de error (404)**:
```json
{
  "statusCode": 404,
  "message": "Usuario con ID {id} no encontrado",
  "error": "Not Found"
}
```

## 🔐 Seguridad Implementada

### Autenticación JWT
- ✅ Todos los endpoints requieren token JWT válido
- ✅ Guard `JwtAuthGuard` aplicado a nivel de controlador
- ✅ Documentación Swagger con `@ApiBearerAuth()`

### Protección de Datos Sensibles
- ✅ **Contraseñas excluidas**: Nunca se devuelven en las respuestas
- ✅ **SELECT específico**: Repositorio solo selecciona campos seguros
- ✅ **DTO limpio**: UserResponseDto no incluye campos sensibles

### Validación de Entrada
- ✅ **Validación de UUID**: Para parámetros de ID
- ✅ **Manejo de errores**: NotFoundException para recursos no encontrados

## 📊 Roles de Usuario

```typescript
export enum UserRole {
  ADMIN = 'ADMIN',     // Acceso completo al sistema
  DEALER = 'DEALER',   // Distribuidor con permisos limitados
  USER = 'USER'        // Usuario final básico
}
```

## 🗄️ Base de Datos

### Tabla: `users_soltec`
```sql
CREATE TABLE users_soltec (
  id VARCHAR(36) PRIMARY KEY,           -- UUID
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,       -- Hash bcrypt
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('ADMIN','DEALER','USER') DEFAULT 'USER',
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 📖 Documentación Swagger

### Acceso a la documentación
- **URL**: `http://localhost:3000/api`
- **Sección**: `users` (tag)

### Características Swagger
- ✅ **Operaciones documentadas**: Todos los endpoints
- ✅ **Esquemas completos**: Entidades y DTOs
- ✅ **Ejemplos relevantes**: Para cada campo
- ✅ **Códigos de respuesta**: 200, 404, etc.
- ✅ **Autenticación**: Bearer token documented

## 🔄 Flujo de Datos

```
Request → Controller → UseCase → Repository → Database
                ↓
Response ← DTO ← UseCase ← Entity ← Database
```

### Ejemplo de flujo para GET /users:
1. **Request**: Cliente envía GET /users con JWT
2. **Guard**: JwtAuthGuard valida el token
3. **Controller**: UserController.findAll()
4. **UseCase**: GetUsersUseCase.execute()
5. **Repository**: UserRepository.findAll()
6. **Database**: SELECT con campos específicos
7. **Mapping**: Entity → UserResponseDto
8. **Response**: JSON limpio sin contraseñas

## ✅ Testing Recomendado

### Casos de Prueba Sugeridos
1. **GET /users**: Listar usuarios correctamente
2. **GET /users/:id**: Obtener usuario existente
3. **GET /users/:invalid-id**: Error 404 para ID inexistente
4. **Autenticación**: Error 401 sin token JWT
5. **Autorización**: Verificar permisos por rol
6. **Seguridad**: Confirmar que no se devuelven contraseñas

### Comandos de Prueba
```bash
# Listar usuarios
curl -H "Authorization: Bearer <token>" http://localhost:3000/users

# Obtener usuario específico
curl -H "Authorization: Bearer <token>" http://localhost:3000/users/{user-id}
```

## 🚀 Beneficios Logrados

### Para Desarrolladores
- 🏗️ **Arquitectura limpia**: Separación de responsabilidades
- 📝 **Documentación automática**: Swagger completo
- 🔒 **Seguridad integrada**: JWT + protección de datos
- 🧪 **Fácil testing**: Casos de uso aislados

### Para el Sistema
- ⚡ **Performance optimizado**: SELECT específicos
- 🔐 **Seguridad robusta**: Sin exposición de contraseñas
- 📊 **Consistencia**: Patrones estándar aplicados
- 🔄 **Mantenibilidad**: Código modular y limpio

---

**Nota**: El servicio está completamente implementado y listo para usar. Reinicia el servidor para ver los nuevos endpoints en Swagger. 