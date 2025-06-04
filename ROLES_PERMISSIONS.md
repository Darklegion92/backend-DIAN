# Sistema de Roles y Permisos

Este documento describe las restricciones de acceso implementadas en la API según los roles de usuario.

## Roles Disponibles

- **ADMIN**: Administrador con acceso completo al sistema
- **DEALER**: Distribuidor con acceso limitado a sus empresas asignadas
- **USER**: Usuario básico con acceso limitado

## Restricciones por Endpoint

### Autenticación
- `POST /api/auth/login` - **TODOS** ✅
- `POST /api/auth/logout` - **TODOS** ✅

### Gestión de Usuarios
- `GET /api/users/currentUser` - **TODOS** ✅
- `PUT /api/users/change-password` - **TODOS** ✅
- `GET /api/users` - **ADMIN** ✅
- `POST /api/users` - **ADMIN** ✅
- `GET /api/users/{id}` - **ADMIN** ✅
- `PUT /api/users/{id}` - **ADMIN** ✅

### Gestión de Empresas
- `GET /api/companies` - **ADMIN, DEALER** (DEALER solo sus empresas) ✅
- `POST /api/companies` - **ADMIN, DEALER** ✅
- `GET /api/companies/{id}` - **ADMIN, DEALER** (DEALER solo si le pertenece) ✅
- `PUT /api/companies/environment` - **ADMIN, DEALER** (DEALER solo si le pertenece) ✅

### Catálogos
- `GET /api/catalogs/*` - **TODOS** (incluye type-documents) ✅
- `GET /api/catalogs/type-documents` - **TODOS** ✅

### Software
- `POST /api/software` - **ADMIN, DEALER** ✅

### Certificados
- `PUT /api/certificate` - **ADMIN, DEALER** ✅

### Resoluciones
- `PUT /api/resolution` - **ADMIN, DEALER** ✅
- `GET /api/resolution/company` - **ADMIN, DEALER** (DEALER solo sus empresas) ✅
- `GET /api/resolution/company-by-nit` - **TODOS** ✅

### Facturas
- `POST /api/invoice` - **TODOS** ✅

### Documentos
- `POST /api/documents` - **ADMIN, DEALER** (DEALER solo sus empresas) ✅
- `GET /api/documents` - **TODOS** (filtrado por empresa del usuario) ✅

## Guards Implementados

### RolesGuard
- Verifica que el usuario tenga uno de los roles requeridos
- Se aplica a endpoints específicos con el decorador `@Roles()`

### DealerAccessGuard
- Permite acceso completo a ADMIN
- Para DEALER, permite acceso pero la validación específica de empresas se debe implementar en cada servicio
- Se aplica a endpoints donde DEALER debe tener acceso limitado a sus empresas

## Decoradores

### @Roles(...roles)
- Define qué roles pueden acceder a un endpoint específico
- Se usa junto con RolesGuard

## Implementación

### Guards Globales
Los guards están registrados en `CommonModule` y están disponibles globalmente:
- `RolesGuard`
- `DealerAccessGuard`

### Uso en Controladores
```typescript
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
// Solo ADMIN puede acceder

@UseGuards(DealerAccessGuard)
@Roles(UserRole.ADMIN, UserRole.DEALER)
// ADMIN acceso completo, DEALER con validación de empresas
```

## Notas Importantes

1. **Validación de Empresas para DEALER**: Los guards permiten el acceso, pero cada servicio debe implementar la lógica específica para verificar que el DEALER solo acceda a sus empresas asignadas.

2. **Autenticación Base**: Todos los endpoints (excepto login) requieren autenticación JWT válida.

3. **Endpoints TODO**: Algunos endpoints están marcados como "TODO" y necesitan implementación completa de la lógica de negocio.

4. **Filtrado Automático**: Los servicios deben implementar filtrado automático basado en el rol del usuario para garantizar el acceso apropiado a los datos.

## Cambios Recientes

### Migración de Type-Documents a Catálogos
- **Antes**: `/api/type-documents` (endpoint separado)
- **Ahora**: `/api/catalogs/type-documents` (parte de catálogos)
- **Motivo**: Los tipos de documento son catálogos de solo lectura
- **Funcionalidad removida**: Método POST (creación) - no es necesario 