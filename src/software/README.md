# Software Module

## Descripción
Módulo para la gestión de software de facturación electrónica DIAN, registro y configuración de identificadores de software ante la DIAN, siguiendo los principios de **Arquitectura Hexagonal**.

## Estructura

```
software/
├── software.module.ts            # Módulo principal
├── README.md                     # Documentación del módulo
├── presentation/                 # Capa de Presentación
│   ├── controllers/              # Controladores REST
│   │   └── software.controller.ts
│   └── dtos/                     # DTOs de entrada/salida
│       ├── create-software.dto.ts
│       └── software-response.dto.ts
├── application/                  # Capa de Aplicación
│   └── services/                 # Servicios de aplicación
│       └── software.service.ts
└── domain/                       # Capa de Dominio
    └── entities/                 # Entidades de dominio
        └── software.entity.ts
```

## Componentes Principales

### Presentation Layer

#### Controllers
- **SoftwareController**: Gestión de endpoints para software
  - `POST /software` - Crear/actualizar software en DIAN

#### DTOs
- **create-software.dto.ts**: Datos para crear software en servicio externo DIAN
- **software-response.dto.ts**: Respuesta del servicio externo de software

### Application Layer

#### Services
- **SoftwareService**: Lógica de negocio para gestión de software
  - Comunicación con API externa DIAN
  - Registro de identificadores de software
  - Configuración de URLs de servicios
  - Manejo de PINs y tokens de autorización

### Domain Layer

#### Entities
- **Software**: Entidad principal con información de software DIAN
  - Identificadores únicos de software
  - PINs de autenticación
  - URLs de servicios DIAN
  - Configuración de nómina y documentos equivalentes

## Funcionalidades Principales

### 📋 Gestión de Software
- ✅ **Registro** de software ante la DIAN
- ✅ **Actualización** de configuraciones de software
- ✅ **Validación** de identificadores y PINs
- ✅ **Comunicación** con servicios externos DIAN

### 🔐 Autenticación y Seguridad
- ✅ **Bearer Token** requerido para API externa
- ✅ **JWT Auth Guard** para protección de endpoints
- ✅ **Validación estricta** de datos de entrada
- ✅ **Manejo de errores** personalizado

### 🌐 Integración Externa
- ✅ **API DIAN** para registro de software
- ✅ **Reenvío de tokens** para autenticación externa
- ✅ **Configuración** de ambientes y URLs de servicios
- ✅ **Mapeo automático** de respuestas de servicios

## Endpoints Disponibles

### 📋 Crear/Actualizar Software
```http
POST /software
Body: CreateSoftwareDto
Headers: Authorization: Bearer <token>
```

## Dependencias

### Módulos Externos
- **CommonModule**: DTOs compartidos, guards, interceptors
- **ConfigModule**: Variables de entorno y configuración
- **TypeOrmModule**: Acceso a base de datos

### Entidades Relacionadas
- **Software**: Configuración de software DIAN
- **Resolution**: Resoluciones asociadas al software
- **Company**: Empresas que utilizan el software

## Configuración

### Variables de Entorno Requeridas
```env
# API Externa DIAN
EXTERNAL_SERVER_URL=https://api.dian.gov.co
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=24h

# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=dian_db
DB_USERNAME=user
DB_PASSWORD=password
```

## Validaciones

### CreateSoftwareDto
- **id**: String requerido, identificador único UUID
- **pin**: Number requerido, PIN numérico del software
- **token**: String requerido para autenticación externa

## Responses API

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Software creado/actualizado con éxito",
  "software": {
    "id": 1,
    "identifier": "f46f2b97-dfce-4b0d-a0cb-2ebd67c72e6d",
    "pin": "25656",
    "identifier_payroll": "",
    "pin_payroll": "",
    "identifier_eqdocs": "",
    "pin_eqdocs": "",
    "url": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
    "url_payroll": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
    "url_eqdocs": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
    "created_at": "2025-06-01 20:29:43",
    "updated_at": "2025-06-01 20:29:43"
  }
}
```

### Respuesta de Error
```json
{
  "statusCode": 400,
  "message": [
    "El identificador es requerido",
    "El PIN debe ser un número",
    "El token es requerido"
  ],
  "error": "Bad Request"
}
```

## Patrones Aplicados

1. **Service Layer**: Separación de lógica de negocio
2. **DTO Pattern**: Validación y transformación de datos
3. **Repository Pattern**: A través de TypeORM
4. **External API Integration**: Comunicación con servicios DIAN
5. **Error Handling**: Manejo robusto de excepciones
6. **Authentication**: JWT Guards y Bearer Tokens

## Flujo de Trabajo

### Registro de Software
1. **Validación** de datos de entrada (DTO)
2. **Autenticación** mediante Bearer Token
3. **Llamada** al servicio externo DIAN
4. **Procesamiento** de respuesta
5. **Retorno** de datos estructurados

### Estructura de Software DIAN
- **Software Principal**: Para facturación electrónica
- **Software de Nómina**: Para documentos de nómina
- **Software Equivalente**: Para documentos equivalentes
- **URLs de Servicios**: Configuración de endpoints DIAN

## Evolución del Módulo

Para agregar nuevas funcionalidades:

1. **Crear DTOs** en `presentation/dtos/`
2. **Agregar endpoints** en `SoftwareController`
3. **Implementar lógica** en `SoftwareService`
4. **Documentar cambios** en este README

## Notas Importantes

- ⚠️ **Identificador UUID**: Debe ser único y válido para cada software
- 🔒 **PIN de Seguridad**: Número de identificación asignado por DIAN
- 📋 **Token de Empresa**: Requerido para autenticación con servicios DIAN
- 🌐 **URLs de Servicios**: Configuradas automáticamente por la DIAN
- 🔄 **Actualización**: Permite modificar configuraciones existentes
- 📊 **Múltiples Tipos**: Soporte para facturación, nómina y documentos equivalentes

## Casos de Uso

### Registro Inicial
- Nuevo software registrado ante la DIAN
- Obtención de identificadores y PINs
- Configuración de URLs de servicios

### Actualización de Configuración
- Modificación de parámetros existentes
- Actualización de URLs de servicios
- Sincronización con cambios de la DIAN

### Consulta de Estado
- Verificación de configuración actual
- Validación de identificadores
- Monitoreo de servicios activos 