# Guía para Agregar Swagger a las Entidades

## Introducción
Se han agregado decoradores de Swagger a las entidades principales del sistema DIAN API 2025. Esta guía proporciona un patrón estándar para agregar documentación Swagger a las entidades restantes.

## Entidades con Swagger Completado

### Entidades Principales
- ✅ `Administrator` - Administradores del sistema
- ✅ `Employee` - Empleados 
- ✅ `User` - Usuarios del sistema
- ✅ `Company` - Empresas
- ✅ `Customer` - Clientes

### Entidades de Documentos
- ✅ `TypeDocument` - Tipos de documentos
- ⏳ `Document` - Documentos
- ⏳ `DocumentPayroll` - Documentos de nómina
- ⏳ `ReceivedDocument` - Documentos recibidos

### Entidades de Configuración
- ✅ `Country` - Países
- ✅ `TypeDocumentIdentification` - Tipos de documentos de identificación
- ✅ `PaymentForm` - Formas de pago
- ✅ `UnitMeasure` - Unidades de medida
- ✅ `TypeCurrency` - Tipos de moneda
- ✅ `Event` - Eventos
- ⏳ `Department` - Departamentos
- ⏳ `Municipality` - Municipios
- ⏳ `TypeOrganization` - Tipos de organización
- ⏳ `TypeRegime` - Tipos de régimen
- ⏳ `TypeLiability` - Tipos de responsabilidad
- ⏳ `TypeOperation` - Tipos de operación
- ⏳ `TypeEnvironment` - Tipos de ambiente
- ⏳ `PaymentMethod` - Métodos de pago
- ⏳ `Discount` - Descuentos
- ⏳ `TypeDiscount` - Tipos de descuento
- ⏳ `TypeRejection` - Tipos de rechazo
- ⏳ `Language` - Idiomas
- ⏳ `Tax` - Impuestos
- ⏳ `Software` - Software
- ⏳ `Resolution` - Resoluciones
- ⏳ `Certificate` - Certificados
- ⏳ `Log` - Logs
- ⏳ `Send` - Envíos

### Entidades de Nómina
- ⏳ `TypeWorker` - Tipos de trabajador
- ⏳ `PayrollTypeDocumentIdentification` - Tipos de documentos de nómina
- ⏳ `PayrollPeriod` - Períodos de nómina
- ⏳ `TypeContract` - Tipos de contrato

### Entidades de Planes
- ⏳ `TypePlan` - Tipos de planes

## Patrón Estándar para Swagger

### 1. Importar Decoradores
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
```

### 2. Decoradores para Propiedades

#### Para propiedades requeridas:
```typescript
@ApiProperty({
  description: 'Descripción clara del campo',
  example: 'Valor de ejemplo',
})
@Column({ name: 'field_name', type: 'varchar' })
fieldName: string;
```

#### Para propiedades opcionales/nullable:
```typescript
@ApiPropertyOptional({
  description: 'Descripción clara del campo opcional',
  example: 'Valor de ejemplo',
})
@Column({ name: 'field_name', type: 'varchar', nullable: true })
fieldName: string;
```

#### Para IDs (Primary Keys):
```typescript
@ApiProperty({
  description: 'ID único del registro',
  example: 1,
})
@PrimaryGeneratedColumn('increment')
id: number;
```

#### Para fechas de auditoría:
```typescript
@ApiProperty({
  description: 'Fecha de creación del registro',
  example: '2024-01-15T10:30:00Z',
})
@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@ApiProperty({
  description: 'Fecha de última actualización del registro',
  example: '2024-01-15T10:30:00Z',
})
@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;
```

#### Para estados booleanos:
```typescript
@ApiProperty({
  description: 'Estado activo/inactivo del registro',
  example: true,
})
@Column({ name: 'state', type: 'boolean', default: true })
state: boolean;
```

### 3. Ejemplos Específicos por Tipo de Entidad

#### Entidades de Configuración (Catálogos):
```typescript
@ApiProperty({
  description: 'Nombre del elemento',
  example: 'Nombre descriptivo',
})
@Column({ name: 'name', type: 'varchar' })
name: string;

@ApiProperty({
  description: 'Código único del elemento',
  example: '001',
})
@Column({ name: 'code', type: 'varchar' })
code: string;
```

#### Entidades de Ubicación:
```typescript
@ApiProperty({
  description: 'ID del país/departamento padre',
  example: 1,
})
@Column({ name: 'parent_id', type: 'int' })
parentId: number;
```

#### Entidades de Documentos:
```typescript
@ApiProperty({
  description: 'Número del documento',
  example: 'FV-001',
})
@Column({ name: 'number', type: 'varchar' })
number: string;

@ApiProperty({
  description: 'Fecha del documento',
  example: '2024-01-15',
})
@Column({ name: 'date', type: 'date' })
date: Date;
```

## Instrucciones para Aplicar

1. **Abrir cada archivo de entidad restante**
2. **Agregar el import**: `import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';`
3. **Agregar decoradores a cada propiedad** siguiendo los patrones arriba
4. **Usar `@ApiProperty`** para campos requeridos
5. **Usar `@ApiPropertyOptional`** para campos nullable/opcionales
6. **Proporcionar descripciones claras** y ejemplos relevantes
7. **Mantener consistencia** en las descripciones y ejemplos

## Beneficios de la Documentación Swagger

- 📚 **Documentación automática** de la API
- 🔍 **Exploración interactiva** de endpoints
- ✅ **Validación de tipos** en tiempo de desarrollo
- 🚀 **Mejor experiencia de desarrollo** para consumidores de la API
- 📖 **Especificación OpenAPI** estándar

## Próximos Pasos

1. Aplicar Swagger a las entidades restantes marcadas con ⏳
2. Configurar Swagger en el módulo principal de NestJS
3. Definir DTOs con decoradores Swagger para endpoints
4. Documentar controladores con decoradores de operaciones Swagger

---

**Nota**: Los errores de linter CRLF se pueden resolver configurando el editor para usar LF como terminador de línea, pero no afectan la funcionalidad del código. 