# Sistema de Paginación - Guía Completa

## 📋 Resumen
Se ha implementado un sistema completo de paginación reutilizable para todos los listados del sistema DIAN API 2025, mejorando significativamente el rendimiento y la experiencia del usuario.

## 🏗️ Arquitectura del Sistema de Paginación

### Componentes Principales

#### 1. DTOs Comunes Reutilizables

**PaginationQueryDto** - `src/common/dtos/pagination-query.dto.ts`
```typescript
export class PaginationQueryDto {
  page?: number = 1;           // Página actual (min: 1)
  limit?: number = 10;         // Elementos por página (max: 100)
  sortBy?: string = 'createdAt'; // Campo de ordenamiento
  sortOrder?: 'ASC' | 'DESC' = 'DESC'; // Dirección
  
  getOffset(): number {        // Helper para calcular offset
    return (this.page - 1) * this.limit;
  }
}
```

**PaginatedResponseDto** - `src/common/dtos/paginated-response.dto.ts`
```typescript
export class PaginatedResponseDto<T> {
  data: T[];                   // Datos de la página actual
  meta: PaginationMetaDto;     // Metadatos de paginación
  
  static create<T>(           // Factory method
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
  ): PaginatedResponseDto<T>
}
```

#### 2. Metadatos de Paginación
```typescript
export class PaginationMetaDto {
  currentPage: number;         // Página actual
  itemsPerPage: number;        // Elementos por página
  totalItems: number;          // Total de elementos
  totalPages: number;          // Total de páginas
  hasPreviousPage: boolean;    // Si hay página anterior
  hasNextPage: boolean;        // Si hay página siguiente
}
```

## 🚀 Servicios con Paginación Implementados

### 1. Servicio de Usuarios

#### Repositorio
```typescript
// user.repository.ts
async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<PaginatedUsers> {
  const [users, total] = await this.userRepository.findAndCount({
    select: ['id', 'username', 'email', 'role', 'name', 'createdAt', 'updatedAt'],
    order: { [sortBy]: sortOrder },
    skip: paginationQuery.getOffset(),
    take: limit,
  });
  
  return { users, total };
}
```

#### Caso de Uso
```typescript
// get-users-paginated.use-case.ts
async execute(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
  const { users, total } = await this.userRepository.findAllPaginated(paginationQuery);
  
  const userResponseDtos = users.map(user => ({...})); // Mapeo a DTO
  
  return PaginatedResponseDto.create(userResponseDtos, total, page, limit);
}
```

#### Endpoints
```typescript
// GET /users/paginated - Con paginación
// GET /users - Sin paginación (retrocompatibilidad)
```

### 2. Servicio de Compañías

#### Servicio
```typescript
// company.service.ts
async getCompaniesByUserPaginated(
  currentUser: User, 
  paginationQuery: PaginationQueryDto
): Promise<PaginatedResponseDto<CompanyWithCertificateDto>> {
  
  let queryBuilder = this.companyRepository
    .createQueryBuilder('company')
    .leftJoinAndSelect('company.soltecUser', 'soltecUser');

  // Aplicar filtros según rol
  if (currentUser.role !== UserRole.ADMIN) {
    queryBuilder = queryBuilder.where('company.soltec_user_id = :userId', { userId: currentUser.id });
  }

  // Aplicar ordenamiento y paginación
  const [companies, totalItems] = await queryBuilder
    .orderBy(`company.${sortBy}`, sortOrder)
    .skip(paginationQuery.getOffset())
    .take(limit)
    .getManyAndCount();

  // Procesar con certificados...
  return PaginatedResponseDto.create(companiesWithCertificates, totalItems, page, limit);
}
```

#### Endpoints
```typescript
// GET /companies/paginated - Con paginación
// GET /companies - Sin paginación (retrocompatibilidad)
```

## 📖 Documentación Swagger

### Parámetros de Query Documentados
```typescript
@ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
@ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
@ApiQuery({ name: 'sortBy', required: false, description: 'Campo para ordenar', example: 'createdAt' })
@ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del ordenamiento', example: 'DESC' })
```

### Esquema de Respuesta Documentado
```typescript
@ApiResponse({
  status: 200,
  description: 'Lista paginada obtenida exitosamente',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/ResponseDto' }
      },
      meta: {
        type: 'object',
        properties: {
          currentPage: { type: 'number', example: 1 },
          itemsPerPage: { type: 'number', example: 10 },
          totalItems: { type: 'number', example: 25 },
          totalPages: { type: 'number', example: 3 },
          hasPreviousPage: { type: 'boolean', example: false },
          hasNextPage: { type: 'boolean', example: true },
        }
      }
    }
  }
})
```

## 🔧 Validaciones Implementadas

### En PaginationQueryDto
```typescript
@IsOptional()
@Type(() => Number)
@IsPositive({ message: 'La página debe ser un número positivo' })
@Min(1, { message: 'La página mínima es 1' })
page?: number = 1;

@IsOptional()
@Type(() => Number)
@IsPositive({ message: 'El límite debe ser un número positivo' })
@Min(1, { message: 'El límite mínimo es 1' })
@Max(100, { message: 'El límite máximo es 100' })
limit?: number = 10;
```

### Beneficios de Validación
- ✅ **Prevención de ataques**: Límite máximo de 100 elementos
- ✅ **Valores por defecto**: Funcionamiento sin parámetros
- ✅ **Transformación automática**: String a Number
- ✅ **Mensajes claros**: Errores descriptivos en español

## 🌐 Ejemplos de Uso

### 1. Listar Usuarios Paginados

**Request:**
```http
GET /users/paginated?page=2&limit=5&sortBy=name&sortOrder=ASC
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "user-id-1",
      "username": "alice",
      "email": "alice@example.com",
      "role": "USER",
      "name": "Alice Johnson",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-10T08:00:00Z"
    },
    {
      "id": "user-id-2",
      "username": "bob",
      "email": "bob@example.com",
      "role": "DEALER",
      "name": "Bob Smith",
      "createdAt": "2024-01-12T10:00:00Z",
      "updatedAt": "2024-01-12T10:00:00Z"
    }
  ],
  "meta": {
    "currentPage": 2,
    "itemsPerPage": 5,
    "totalItems": 23,
    "totalPages": 5,
    "hasPreviousPage": true,
    "hasNextPage": true
  }
}
```

### 2. Listar Compañías Paginadas

**Request:**
```http
GET /companies/paginated?page=1&limit=10&sortBy=name&sortOrder=DESC
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "identificationNumber": "901234567",
      "name": "Empresa ABC S.A.S",
      "email": "contacto@empresa-abc.com",
      "certificateExpirationDate": "2025-12-31T00:00:00Z",
      "certificateId": 123,
      "certificateName": "Certificado Digital ABC",
      // ... más campos
    }
  ],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 15,
    "totalPages": 2,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

### 3. Valores por Defecto

**Request:**
```http
GET /users/paginated
Authorization: Bearer <token>
```

**Comportamiento:**
- `page=1` (primera página)
- `limit=10` (10 elementos)
- `sortBy=createdAt` (ordenado por fecha de creación)
- `sortOrder=DESC` (más recientes primero)

## ⚡ Beneficios de Performance

### Antes (Sin Paginación)
```sql
-- Consulta que trae TODOS los registros
SELECT * FROM users_soltec ORDER BY created_at DESC;
-- Resultado: 10,000+ registros en memoria
```

### Después (Con Paginación)
```sql
-- Consulta optimizada con LIMIT y OFFSET
SELECT * FROM users_soltec 
ORDER BY created_at DESC 
LIMIT 10 OFFSET 0;
-- Resultado: Solo 10 registros en memoria
```

### Mejoras Logradas
- 🚀 **Reducción de memoria**: 99% menos datos en memoria
- ⏱️ **Tiempo de respuesta**: Respuestas sub-segundo
- 📊 **Escalabilidad**: Funciona con millones de registros
- 🌐 **UX mejorada**: Carga progresiva de datos

## 🔄 Retrocompatibilidad

### Estrategia Implementada
1. **Nuevos endpoints**: `/resource/paginated` para paginación
2. **Endpoints existentes**: `/resource` sin cambios
3. **Gradual adoption**: Migración opcional

### Ejemplo
```typescript
// ✅ NUEVO - Con paginación
GET /users/paginated?page=1&limit=10

// ✅ EXISTENTE - Sin cambios
GET /users

// ✅ NUEVO - Con paginación
GET /companies/paginated?page=1&limit=10

// ✅ EXISTENTE - Sin cambios  
GET /companies
```

## 🎯 Patrones de Implementación

### Para Agregar Paginación a un Nuevo Servicio

1. **Actualizar Repositorio:**
```typescript
async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<{items: T[], total: number}> {
  const [items, total] = await this.repository.findAndCount({
    order: { [paginationQuery.sortBy]: paginationQuery.sortOrder },
    skip: paginationQuery.getOffset(),
    take: paginationQuery.limit,
  });
  
  return { items, total };
}
```

2. **Crear Caso de Uso:**
```typescript
async execute(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ResponseDto>> {
  const { items, total } = await this.repository.findAllPaginated(paginationQuery);
  const dtos = items.map(item => this.mapToDto(item));
  
  return PaginatedResponseDto.create(dtos, total, paginationQuery.page, paginationQuery.limit);
}
```

3. **Agregar Endpoint:**
```typescript
@Get('paginated')
@ApiOperation({ summary: 'Obtener lista paginada' })
// ... documentación Swagger
async findAllPaginated(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<ResponseDto>> {
  return this.useCase.execute(paginationQuery);
}
```

## 🛠️ Testing de Paginación

### Casos de Prueba Recomendados

```typescript
describe('Pagination', () => {
  it('should return first page with default values', async () => {
    const result = await controller.findAllPaginated({});
    
    expect(result.meta.currentPage).toBe(1);
    expect(result.meta.itemsPerPage).toBe(10);
    expect(result.data.length).toBeLessThanOrEqual(10);
  });

  it('should return correct page navigation info', async () => {
    const result = await controller.findAllPaginated({ page: 2, limit: 5 });
    
    expect(result.meta.currentPage).toBe(2);
    expect(result.meta.hasPreviousPage).toBe(true);
  });

  it('should validate maximum limit', async () => {
    await expect(
      controller.findAllPaginated({ limit: 150 })
    ).rejects.toThrow('El límite máximo es 100');
  });
});
```

## 📊 Monitoreo y Métricas

### Métricas Recomendadas para Monitorear

1. **Performance:**
   - Tiempo de respuesta por endpoint paginado
   - Uso de memoria antes/después
   - Queries por segundo

2. **Uso:**
   - Páginas más solicitadas
   - Límites más usados
   - Campos de ordenamiento preferidos

3. **Errores:**
   - Validaciones fallidas
   - Páginas fuera de rango
   - Timeouts de base de datos

## 🚀 Próximos Pasos

### Funcionalidades Adicionales Sugeridas

1. **Filtrado Avanzado:**
   ```typescript
   export class FilterQueryDto {
     search?: string;           // Búsqueda general
     dateFrom?: Date;          // Filtro por fecha inicio
     dateTo?: Date;            // Filtro por fecha fin
     status?: string[];        // Filtro por múltiples estados
   }
   ```

2. **Cache de Resultados:**
   ```typescript
   @Cacheable(ttl: 300) // 5 minutos
   async findAllPaginated(query: PaginationQueryDto) {
     // ... implementación
   }
   ```

3. **Exportación de Datos:**
   ```typescript
   @Get('export')
   async exportToCsv(@Query() filters: FilterQueryDto): Promise<StreamableFile> {
     // Exportar resultados filtrados
   }
   ```

## 📋 Checklist de Implementación

### Para Cada Nuevo Servicio con Paginación:

- [ ] ✅ Agregar método `findAllPaginated` al repositorio
- [ ] ✅ Crear caso de uso con `PaginatedResponseDto`
- [ ] ✅ Agregar endpoint `/resource/paginated`
- [ ] ✅ Mantener endpoint `/resource` para retrocompatibilidad  
- [ ] ✅ Documentar con Swagger (`@ApiQuery`, `@ApiResponse`)
- [ ] ✅ Agregar validaciones a query parameters
- [ ] ✅ Implementar tests unitarios
- [ ] ✅ Actualizar documentación del servicio
- [ ] ✅ Verificar performance con datos reales

---

**Nota**: El sistema de paginación está completamente implementado y listo para usar. Todos los servicios pueden adoptarlo siguiendo los patrones establecidos. 