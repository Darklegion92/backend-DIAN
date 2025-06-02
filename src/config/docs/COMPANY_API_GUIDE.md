# 🏢 Guía del API de Creación de Compañías

Esta guía proporciona información detallada sobre cómo usar el endpoint para crear compañías en el servicio externo de la DIAN.

## 📋 Información General

**Endpoint:** `POST /companies/external`  
**Autenticación:** Bearer Token (JWT) requerido  
**Content-Type:** `application/json`

## 🔐 Autenticación

```bash
Authorization: Bearer <tu-jwt-token>
```

## 📝 Estructura del Request

### Headers Requeridos
```http
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

### Body Parameters

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| `nit` | string | ✅ | NIT sin dígito de verificación (8-15 dígitos) | `"900123456"` |
| `digito` | string | ✅ | Dígito de verificación del NIT (1 dígito) | `"7"` |
| `type_document_identification_id` | number | ✅ | ID tipo documento según catálogo DIAN | `6` |
| `type_organization_id` | number | ✅ | ID tipo organización según catálogo DIAN | `2` |
| `type_regime_id` | number | ✅ | ID tipo régimen tributario según catálogo DIAN | `2` |
| `type_liability_id` | number | ✅ | ID tipo responsabilidad según catálogo DIAN | `14` |
| `business_name` | string | ✅ | Razón social de la empresa (2-255 caracteres) | `"TECNOLOGÍA S.A.S."` |
| `merchant_registration` | string | ✅ | Matrícula mercantil (6-20 caracteres) | `"12345678"` |
| `municipality_id` | number | ✅ | ID municipio según catálogo DIAN | `149` |
| `address` | string | ✅ | Dirección física (10-255 caracteres) | `"Carrera 15 #93-47"` |
| `phone` | string | ✅ | Teléfono con formato internacional | `"+57 1 123 4567"` |
| `email` | string | ✅ | Email corporativo único | `"contacto@empresa.com"` |

## 🎯 Ejemplos de Uso

### Ejemplo 1: Empresa Tecnológica S.A.S.

```json
{
  "nit": "900123456",
  "digito": "7",
  "type_document_identification_id": 6,
  "type_organization_id": 2,
  "type_regime_id": 2,
  "type_liability_id": 14,
  "business_name": "TECNOLOGÍA Y DESARROLLO S.A.S.",
  "merchant_registration": "12345678",
  "municipality_id": 149,
  "address": "Carrera 15 #93-47, Oficina 501",
  "phone": "+57 1 123 4567",
  "email": "contacto@tecnodesarrollo.com"
}
```

### Ejemplo 2: Comercializadora LTDA

```json
{
  "nit": "800987654",
  "digito": "3",
  "type_document_identification_id": 6,
  "type_organization_id": 1,
  "type_regime_id": 1,
  "type_liability_id": 14,
  "business_name": "COMERCIALIZADORA DEL CARIBE LTDA",
  "merchant_registration": "87654321",
  "municipality_id": 149,
  "address": "Calle 72 #10-34, Local 102",
  "phone": "+57 5 987 6543",
  "email": "info@comercaribe.co"
}
```

## ✅ Respuesta Exitosa (201)

```json
{
  "id": 15,
  "identificationNumber": "900123456",
  "dv": "7",
  "typeDocumentIdentificationId": 6,
  "typeOrganizationId": 2,
  "languageId": 79,
  "taxId": 1,
  "typeOperationId": 2,
  "typeRegimeId": 2,
  "typeLiabilityId": 14,
  "municipalityId": 149,
  "typeEnvironmentId": 1,
  "payrollTypeEnvironmentId": 1,
  "eqdocsTypeEnvironmentId": 1,
  "address": "Carrera 15 #93-47, Oficina 501",
  "phone": "+57 1 123 4567",
  "merchantRegistration": "12345678",
  "state": true,
  "allowSellerLogin": false,
  "soltecUserId": "user-uuid-here",
  "createdAt": "2025-01-21T15:30:00Z",
  "updatedAt": "2025-01-21T15:30:00Z",
  "certificateExpirationDate": "2026-01-21T23:59:59Z",
  "certificateId": 8,
  "certificateName": "certificado_900123456.p12"
}
```

## ❌ Códigos de Error

### 400 - Bad Request
**Datos de entrada inválidos**
```json
{
  "statusCode": 400,
  "message": [
    "El NIT debe contener solo números",
    "El correo electrónico debe ser único",
    "La matrícula mercantil no es válida"
  ],
  "error": "Bad Request"
}
```

### 401 - Unauthorized
**Token JWT requerido o inválido**
```json
{
  "statusCode": 401,
  "message": "Token JWT requerido",
  "error": "Unauthorized"
}
```

### 409 - Conflict
**NIT o email ya existe**
```json
{
  "statusCode": 409,
  "message": "Ya existe una empresa con este NIT: 900123456",
  "error": "Conflict"
}
```

### 422 - Unprocessable Entity
**Error de validación en DIAN**
```json
{
  "statusCode": 422,
  "message": "Error de validación en servicio DIAN",
  "error": "Unprocessable Entity",
  "details": {
    "nit": "NIT ya registrado en la DIAN",
    "municipality_id": "Código de municipio inválido"
  }
}
```

### 503 - Service Unavailable
**Servicio DIAN no disponible**
```json
{
  "statusCode": 503,
  "message": "Servicio externo temporalmente no disponible",
  "error": "Service Unavailable"
}
```

## 🔧 Configuración Requerida

### Variables de Entorno
```env
EXTERNAL_SERVER_URL=https://api-dian.example.com
EXTERNAL_SERVICE_TOKEN=your-dian-api-token
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-jwt-secret
```

## 📊 Catálogos DIAN Comunes

### Tipos de Documento de Identificación
- `6`: NIT (Número de Identificación Tributaria)

### Tipos de Organización
- `1`: LTDA (Limitada)
- `2`: S.A.S. (Sociedad por Acciones Simplificada)
- `3`: S.A. (Sociedad Anónima)

### Tipos de Régimen
- `1`: Régimen Común
- `2`: Régimen Simplificado

### Tipos de Responsabilidad Común
- `14`: Gran Contribuyente
- `15`: Autorretenedor
- `48`: No responsable de IVA

### Municipios Principales
- `149`: Bogotá D.C.
- `001`: Medellín
- `078`: Barranquilla
- `001`: Cali

## 🛠️ Pruebas con cURL

```bash
curl -X POST "http://localhost:3000/companies/external" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nit": "900123456",
    "digito": "7",
    "type_document_identification_id": 6,
    "type_organization_id": 2,
    "type_regime_id": 2,
    "type_liability_id": 14,
    "business_name": "EMPRESA EJEMPLO S.A.S.",
    "merchant_registration": "12345678",
    "municipality_id": 149,
    "address": "Carrera 15 #93-47, Oficina 501",
    "phone": "+57 1 123 4567",
    "email": "contacto@ejemplo.com"
  }'
```

## 🔍 Proceso de Validación

1. **Validación de Formato**: Se valida el formato de todos los campos
2. **Validación de Unicidad**: Se verifica que NIT y email no existan
3. **Comunicación Externa**: Se envía al servicio DIAN
4. **Registro Local**: Se guarda en base de datos local
5. **Asociación de Usuario**: Se vincula al usuario autenticado

## 📞 Soporte

Para soporte técnico o preguntas sobre la integración:
- **Email**: soporte@soltec.com
- **Documentación**: `/docs` (Swagger UI)
- **Status API**: `GET /health` 