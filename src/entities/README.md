# Entidades del Sistema DIAN API 2025

Este directorio contiene todas las entidades TypeORM creadas para el sistema DIAN API 2025, basadas en las migraciones de Laravel existentes.

## Estructura de Entidades

### 📋 Entidades Principales

#### Administrator
- **Archivo**: `../administrator/domain/entities/administrator.entity.ts`
- **Tabla**: `administrators`
- **Descripción**: Gestión de administradores del sistema
- **Campos principales**: id, identificationNumber, dv, name, email, plan, state

#### Employee
- **Archivo**: `../employee/domain/entities/employee.entity.ts`
- **Tabla**: `employees`
- **Descripción**: Gestión de empleados
- **Campos principales**: identificationNumber (PK), firstName, middleName, surname, email

#### User
- **Archivo**: `../config/domain/entities/user.entity.ts`
- **Tabla**: `users`
- **Descripción**: Usuarios del sistema
- **Campos principales**: id, identificationNumber, name, email, password

#### Company
- **Archivo**: `../config/domain/entities/company.entity.ts`
- **Tabla**: `companies`
- **Descripción**: Empresas/compañías del sistema
- **Campos principales**: id, identificationNumber, name, address, email

#### Customer
- **Archivo**: `../customer/domain/entities/customer.entity.ts`
- **Tabla**: `customers`
- **Descripción**: Clientes
- **Campos principales**: identificationNumber (PK), name, email, address

### 📄 Entidades de Documentos

#### Document
- **Archivo**: `../document/domain/entities/document.entity.ts`
- **Tabla**: `documents`
- **Descripción**: Documentos principales del sistema
- **Relaciones**: ManyToOne con TypeDocument

#### TypeDocument
- **Archivo**: `../document/domain/entities/type-document.entity.ts`
- **Tabla**: `type_documents`
- **Descripción**: Tipos de documentos

#### DocumentPayroll
- **Archivo**: `../document/domain/entities/document-payroll.entity.ts`
- **Tabla**: `document_payrolls`
- **Descripción**: Documentos de nómina
- **Relaciones**: ManyToOne con TypeDocument

#### ReceivedDocument
- **Archivo**: `../document/domain/entities/received-document.entity.ts`
- **Tabla**: `received_documents`
- **Descripción**: Documentos recibidos
- **Relaciones**: ManyToOne con TypeDocument

### 📊 Entidades de Configuración

#### Ubicación Geográfica
- **Country**: Países
- **Department**: Departamentos (relación con Country)
- **Municipality**: Municipios (relación con Department)

#### Tipos de Identificación y Organización
- **TypeDocumentIdentification**: Tipos de documentos de identificación
- **TypeOrganization**: Tipos de organización
- **TypeRegime**: Tipos de régimen
- **TypeLiability**: Tipos de responsabilidad
- **TypeOperation**: Tipos de operación
- **TypeEnvironment**: Tipos de ambiente

#### Configuración Comercial
- **PaymentForm**: Formas de pago
- **PaymentMethod**: Métodos de pago
- **TypeCurrency**: Tipos de moneda
- **UnitMeasure**: Unidades de medida
- **Discount**: Descuentos
- **TypeDiscount**: Tipos de descuento
- **TypeRejection**: Tipos de rechazo

#### Sistema y Configuración
- **Language**: Idiomas
- **Tax**: Impuestos
- **Software**: Software (relación con Company)
- **Resolution**: Resoluciones (relación con Company y TypeDocument)
- **Certificate**: Certificados (relación con Company)
- **Log**: Logs del sistema (relación con User)
- **Send**: Envíos (relación con Company y TypeDocument)
- **Event**: Eventos

### 💼 Entidades de Nómina

#### Tipos de Trabajadores y Contratos
- **TypeWorker**: Tipos de trabajadores
- **TypeContract**: Tipos de contrato
- **PayrollTypeDocumentIdentification**: Tipos de documentos de identificación para nómina
- **PayrollPeriod**: Períodos de nómina

#### Planes
- **TypePlan**: Tipos de planes del sistema

## Características Técnicas

### Decoradores TypeORM Utilizados
- `@Entity()`: Define la entidad y tabla correspondiente
- `@PrimaryGeneratedColumn()`: Clave primaria auto-incremental
- `@PrimaryColumn()`: Clave primaria personalizada
- `@Column()`: Columnas con configuración específica
- `@CreateDateColumn()`: Timestamp de creación automático
- `@UpdateDateColumn()`: Timestamp de actualización automático
- `@DeleteDateColumn()`: Soft delete timestamp
- `@ManyToOne()`: Relaciones muchos a uno
- `@JoinColumn()`: Especifica la columna de unión
- `@Unique()`: Restricciones de unicidad

### Tipos de Datos Mapeados
- `varchar`: Cadenas de texto
- `char`: Caracteres de longitud fija
- `bigint`: Enteros grandes
- `int`: Enteros
- `boolean`: Valores booleanos
- `datetime`: Fecha y hora
- `date`: Solo fecha
- `time`: Solo hora
- `decimal`: Números decimales con precisión
- `float`: Números flotantes
- `json`: Objetos JSON
- `text`: Texto largo

### Relaciones Implementadas
- **Document → TypeDocument**: Muchos documentos pertenecen a un tipo
- **DocumentPayroll → TypeDocument**: Muchos documentos de nómina pertenecen a un tipo
- **ReceivedDocument → TypeDocument**: Muchos documentos recibidos pertenecen a un tipo
- **Department → Country**: Muchos departamentos pertenecen a un país
- **Municipality → Department**: Muchos municipios pertenecen a un departamento
- **Software → Company**: Muchos software pertenecen a una empresa
- **Resolution → Company, TypeDocument**: Muchas resoluciones pertenecen a una empresa y tipo de documento
- **Certificate → Company**: Muchos certificados pertenecen a una empresa
- **Log → User**: Muchos logs pertenecen a un usuario
- **Send → Company, TypeDocument**: Muchos envíos pertenecen a una empresa y tipo de documento

## Uso

Para importar todas las entidades:

```typescript
import {
  Administrator,
  Employee,
  User,
  Company,
  Customer,
  Document,
  TypeDocument,
  DocumentPayroll,
  ReceivedDocument,
  Country,
  Department,
  Municipality,
  // ... otras entidades
} from './entities';
```

## Notas Importantes

1. **Errores de Linter**: Todas las entidades tienen errores de linter relacionados con caracteres de retorno de carro (CRLF vs LF). Esto se puede resolver configurando el editor para usar LF.

2. **Arquitectura Hexagonal**: Las entidades están organizadas siguiendo la arquitectura hexagonal del proyecto, con cada módulo en su respectiva carpeta `domain/entities`.

3. **Soft Deletes**: Algunas entidades como Document, DocumentPayroll y ReceivedDocument implementan soft deletes con `@DeleteDateColumn()`.

4. **Restricciones de Unicidad**: Entidades como Send tienen restricciones de unicidad compuesta usando `@Unique()`.

5. **Campos Calculados**: Algunos campos como timestamps se manejan automáticamente por TypeORM.

## Entidades Adicionales Pendientes

Basándome en las migraciones encontradas, estas entidades adicionales se pueden crear:

- ReferencePrice
- TypeItemIdentification
- SubTypeWorker
- TypeOvertimeSurcharge
- TypeLawDeduction
- TypeDisability
- HealthTypeUser
- HealthTypeCoverage
- HealthContractingPaymentMethod
- TypePayrollAdjustNote
- CreditNoteDiscrepancyResponse
- DebitNoteDiscrepancyResponse
- TypeGenerationTransmition
- Incoterm
- EmailBlackList
- TypeSpd
- PrepaidPaymentType

Estas entidades siguen el mismo patrón de las ya creadas y se pueden implementar según las necesidades del proyecto. 