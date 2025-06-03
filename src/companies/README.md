# Módulo de Empresas (Companies)

Este módulo maneja las operaciones relacionadas con empresas, incluyendo la actualización de ambientes a producción.

## Estructura del Módulo

El módulo sigue la arquitectura hexagonal (Clean Architecture):

```
companies/
├── application/
│   ├── dtos/
│   │   ├── update-environment.dto.ts
│   │   └── update-environment-response.dto.ts
│   └── use-cases/
│       └── update-environment.use-case.ts
├── domain/
│   ├── entities/
│   │   └── company.entity.ts
│   └── services/
│       └── external-api.service.interface.ts
├── infrastructure/
│   ├── controllers/
│   │   └── companies.controller.ts
│   └── services/
│       └── external-api.service.ts
├── companies.module.ts
└── README.md
```

## Endpoints Disponibles

### PUT /api/companies/:companyId/environment

Actualiza la configuración del ambiente de una empresa específica a producción.

**Parámetros:**
- `companyId` (string): ID único de la empresa

**Body:**
```json
{
  "type_environment_id": 2,
  "payroll_type_environment_id": 2,
  "eqdocs_type_environment_id": 2
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Ambiente actualizado con éxito",
  "company": {
    "id": 3,
    "user_id": 4,
    "identification_number": "901357329",
    "dv": "9",
    "language_id": 79,
    "tax_id": 1,
    "type_environment_id": 2,
    "payroll_type_environment_id": 2,
    "eqdocs_type_environment_id": 2,
    "type_operation_id": 10,
    "type_document_identification_id": 6,
    "country_id": 46,
    "type_currency_id": 35,
    "type_organization_id": 1,
    "type_regime_id": 2,
    "type_liability_id": 14,
    "municipality_id": 780,
    "merchant_registration": "364164",
    "address": "AV 17 7 23 URB TORCOROMA SIGLO XXI",
    "phone": "3115634214",
    "password": null,
    "newpassword": null,
    "type_plan_id": 0,
    "type_plan2_id": 0,
    "type_plan3_id": 0,
    "type_plan4_id": 0,
    "start_plan_date": null,
    "start_plan_date2": null,
    "start_plan_date3": null,
    "start_plan_date4": null,
    "absolut_start_plan_date": null,
    "state": 1,
    "imap_server": null,
    "imap_user": null,
    "imap_password": null,
    "imap_port": null,
    "imap_encryption": null,
    "allow_seller_login": 0,
    "created_at": "2025-06-02 07:27:25",
    "updated_at": "2025-06-03 13:55:33",
    "soltec_user_id": "f6a9ef9f-a6e5-41cc-82f8-1fc57e96c10e",
    "user": {
      "id": 4,
      "name": "GRUPO EMPRESARIAL LUCIO S.A.S.",
      "email": "factgrsupoempresariallucio@gmail.com",
      "email_verified_at": null,
      "created_at": "2025-06-02 07:27:25",
      "updated_at": "2025-06-02 16:42:31",
      "id_administrator": null,
      "mail_host": null,
      "mail_port": null,
      "mail_username": null,
      "mail_password": null,
      "mail_encryption": null,
      "mail_from_address": null,
      "mail_from_name": null
    },
    "send": [
      {
        "id": 1,
        "year": 2025,
        "next_consecutive": 6,
        "created_at": "2025-06-02 11:07:54",
        "updated_at": "2025-06-03 13:04:18"
      }
    ]
  }
}
```

**Errores posibles:**
- `400`: Datos de entrada inválidos
- `404`: Empresa no encontrada
- `502`: Error en el servicio externo
- `503`: Servicio externo no disponible

## Configuración

### Variables de Entorno

Agregar al archivo `.env`:

```env
# External API Configuration
EXTERNAL_API_BASE_URL=https://api.external-service.com
```

### Autenticación

Todos los endpoints requieren autenticación JWT. Incluir el token en el header:

```
Authorization: Bearer <tu_jwt_token>
```

## Servicio Externo

El módulo consume un servicio externo para actualizar la configuración del ambiente. El servicio realiza una petición PUT a:

```
{EXTERNAL_API_BASE_URL}/config/environment?company_id={companyId}
```

Con el body proporcionado en el endpoint y devuelve la información actualizada de la empresa.

## Manejo de Errores

El servicio incluye manejo robusto de errores:

- **Errores de conexión**: Se capturan y devuelven como 503 (Service Unavailable)
- **Errores HTTP**: Se mapean apropiadamente (4xx para errores del cliente, 5xx para errores del servidor)
- **Timeouts**: Configurado con timeout de 30 segundos
- **Logging**: Todos los requests y errores se registran en la consola

## Casos de Uso

### UpdateEnvironmentUseCase

Orquesta la actualización del ambiente de una empresa:

1. Valida que el ID de la empresa sea válido
2. Llama al servicio externo
3. Devuelve la respuesta actualizada

## Servicios

### ExternalApiService

Maneja la comunicación con el servicio externo:

- Configuración de axios con interceptors
- Manejo de timeouts y errores
- Logging de requests y respuestas
- Mapeo de errores HTTP a excepciones NestJS

## Testing

Para probar el endpoint con curl:

```bash
curl -X PUT "http://localhost:8000/api/companies/3/environment" \
  -H "Authorization: Bearer <tu_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type_environment_id": 2,
    "payroll_type_environment_id": 2,
    "eqdocs_type_environment_id": 2
  }'
```

## Swagger Documentation

El endpoint está completamente documentado en Swagger y será visible en:
`http://localhost:8000/api/docs`

Buscar en la sección "🏢 Gestión de Empresas". 