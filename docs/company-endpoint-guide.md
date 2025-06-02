# Endpoint de Consulta de Compañías por Usuario

## Descripción
Se ha implementado un endpoint que permite consultar las compañías asignadas a cada usuario, con control de permisos basado en roles y que incluye información del vencimiento del certificado.

## Endpoints Creados

### 1. GET `/companies`
**Obtener compañías asignadas al usuario actual**

#### Autenticación
- Requiere autenticación JWT
- Header: `Authorization: Bearer <token>`

#### Lógica de Permisos
- **ADMIN**: Obtiene todas las compañías del sistema
- **DEALER/USER**: Solo obtiene las compañías asignadas a su usuario específico

#### Respuesta
- **Status 200**: Lista de compañías con información de certificados
- **Status 401**: No autorizado (token JWT requerido/inválido)

### 2. GET `/companies/:id`
**Obtener una compañía específica por ID**

#### Parámetros
- `id` (number): ID único de la compañía

#### Autenticación
- Requiere autenticación JWT
- Header: `Authorization: Bearer <token>`

#### Lógica de Permisos
- **ADMIN**: Puede acceder a cualquier compañía
- **DEALER/USER**: Solo puede acceder a compañías asignadas a su usuario

#### Respuesta
- **Status 200**: Compañía encontrada con información del certificado
- **Status 404**: Compañía no encontrada o sin permisos para acceder
- **Status 401**: No autorizado (token JWT requerido/inválido)

## Estructura de la Respuesta

```typescript
{
  // Información básica de la compañía
  id: number;
  identificationNumber: string;
  dv?: string;
  name: string;
  address: string;
  phone: string;
  web?: string;
  email: string;
  merchantRegistration: string;
  state: boolean;
  
  // IDs de relaciones
  typeDocumentIdentificationId: number;
  typeOrganizationId: number;
  languageId: number;
  taxId: number;
  typeOperationId: number;
  typeRegimeId: number;
  typeLiabilityId: number;
  municipalityId: number;
  typeEnvironmentId: number;
  payrollTypeEnvironmentId?: number;
  sdTypeEnvironmentId?: number;
  
  // Información de planes
  planDocuments: number;
  planRadianDocuments: number;
  planPayrollDocuments: number;
  planDsDocuments: number;
  planPeriod: number;
  planExpirationDate?: Date;
  
  // Contadores de documentos
  documentsSent: number;
  radianDocumentsSent: number;
  payrollDocumentsSent: number;
  dsDocumentsSent: number;
  
  // Configuración de correo
  mailHost?: string;
  mailPort?: string;
  mailUsername?: string;
  mailPassword?: string;
  mailEncryption?: string;
  mailFromAddress?: string;
  mailFromName?: string;
  
  // Configuración adicional
  password?: string;
  allowSellerLogin: boolean;
  soltecUserId?: string;
  
  // Información del certificado
  certificateExpirationDate?: Date;
  certificateId?: number;
  certificateName?: string;
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
}
```

## Características Técnicas

### Entidades Modificadas
1. **Certificate**: Se agregó el campo `expirationDate` con decoradores Swagger
2. **Company**: Ya tenía relación con `users_soltec` agregada

### Servicios Implementados
- **CompanyService**: Lógica de negocio para consultas con permisos
- Métodos:
  - `getCompaniesByUser(currentUser: User)`
  - `getCompanyWithCertificateById(companyId: number, currentUser: User)`

### DTOs Creados
- **CompanyWithCertificateDto**: DTO completo con todos los campos de compañía + información de certificado

### Controlador
- **CompanyController**: Expone los endpoints con documentación Swagger completa
- Incluye validaciones, guards de autenticación y manejo de errores

## Casos de Uso

### 1. Usuario ADMIN
```bash
GET /companies
Authorization: Bearer <admin-jwt-token>

# Respuesta: Todas las compañías del sistema
```

### 2. Usuario DEALER/USER
```bash
GET /companies
Authorization: Bearer <user-jwt-token>

# Respuesta: Solo compañías asignadas al usuario
```

### 3. Consulta específica con permisos
```bash
GET /companies/123
Authorization: Bearer <jwt-token>

# Si tiene permisos: Status 200 con datos
# Si no tiene permisos: Status 404
```

## Seguridad Implementada

1. **Autenticación JWT**: Todos los endpoints requieren token válido
2. **Control de acceso basado en roles**: 
   - Verificación automática del rol del usuario
   - Filtrado de resultados según permisos
3. **Validación de parámetros**: ParseIntPipe para el ID de compañía
4. **Manejo de errores**: NotFoundException para recursos no encontrados

## Beneficios

- ✅ **Seguridad**: Control granular de permisos por usuario
- ✅ **Completitud**: Incluye todos los campos de compañía + certificado
- ✅ **Documentación**: Swagger completo con ejemplos
- ✅ **Escalabilidad**: Arquitectura modular y reutilizable
- ✅ **Mantenibilidad**: Código limpio y bien estructurado

## Próximos Pasos Sugeridos

1. **Pruebas**: Implementar tests unitarios e integración
2. **Caché**: Considerar implementar Redis para consultas frecuentes
3. **Paginación**: Agregar paginación para usuarios ADMIN con muchas compañías
4. **Filtros**: Implementar filtros por estado, tipo, etc.
5. **Optimización**: Usar JOIN en lugar de consultas separadas para mejor rendimiento 