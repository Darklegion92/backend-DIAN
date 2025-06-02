# Módulo de Facturas - Consumo de Servicio Externo Laravel

Este módulo permite crear facturas consumiendo el servicio externo del sistema Laravel DIAN (apidian2025).

## Configuración

Agregar en las variables de entorno:
```bash
EXTERNAL_INVOICE_API_URL=http://localhost:8000/api
```

## Endpoint Disponible

### Crear Factura
```http
POST /invoice
```

**Body (ejemplo mínimo):**
```json
{
  "type_document_id": 1,
  "number": 1001,
  "prefix": "FE",
  "date": "2024-02-06",
  "time": "10:30:00",
  "sendmail": true,
  "customer": {
    "identification_number": "12345678",
    "dv": 9,
    "first_name": "Juan",
    "family_first_surname": "Pérez",
    "email": "juan.perez@email.com",
    "address": "Calle 123 #45-67",
    "phone": "3001234567"
  },
  "legal_monetary_totals": {
    "line_extension_amount": 100000,
    "tax_exclusive_amount": 100000,
    "tax_inclusive_amount": 119000,
    "payable_amount": 119000
  },
  "invoice_lines": [
    {
      "unit_measure_id": 70,
      "invoiced_quantity": 1,
      "line_extension_amount": 100000,
      "description": "Producto o servicio",
      "price_amount": 100000,
      "code": "PROD001"
    }
  ]
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "data": {
    "success": true,
    "message": "Factura de Venta Electrónica procesada correctamente",
    "cufe": "abc123def456...",
    "QRStr": "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=abc123...",
    "urlinvoicexml": "FES-1001.xml",
    "urlinvoicepdf": "FES-1001.pdf",
    "invoicexml": "base64_encoded_xml...",
    "zipinvoicexml": "base64_encoded_zip...",
    "certificate_days_left": 365,
    "resolution_days_left": 180,
    "ResponseDian": {
      "IsValid": true,
      "StatusCode": "00",
      "StatusDescription": "Procesado Correctamente."
    }
  }
}
```

## Estructura del Módulo

```
invoice/
├── domain/
│   ├── entities/
│   │   └── invoice.entity.ts       # Interfaces TypeScript
│   └── services/
│       └── external-invoice.service.ts
├── infrastructure/
│   ├── controllers/
│   │   └── invoice.controller.ts   # Endpoint POST /invoice
│   └── dto/
│       └── invoice.dto.ts          # DTOs con validaciones
├── invoice.module.ts
└── README.md
```

## Interfaces Principales

### CreateInvoiceRequest
Interface que define la estructura completa del request que se envía a Laravel.

### CreateInvoiceResponse  
Interface que define la estructura de respuesta del servicio Laravel.

### CreateInvoiceDto
DTO con validaciones para el endpoint de NestJS.

## Validaciones Incluidas

- ✅ **Campos requeridos**: Validación de campos obligatorios
- ✅ **Tipos de datos**: Verificación de tipos (string, number, boolean)
- ✅ **Valores mínimos**: Cantidades y montos no negativos
- ✅ **Email válido**: Validación de formato de email
- ✅ **Arrays anidados**: Validación de líneas de factura

## Manejo de Errores

El servicio maneja automáticamente:
- **400 Bad Request**: Datos de entrada inválidos
- **408 Request Timeout**: Timeout del servicio externo
- **500 Internal Server Error**: Errores del servidor Laravel
- **502 Bad Gateway**: Respuesta inválida del servicio externo
- **503 Service Unavailable**: Servicio Laravel no disponible

## Configuración del Servicio Externo

El servicio consume: `POST {EXTERNAL_INVOICE_API_URL}/invoice`

Este endpoint corresponde a las rutas de Laravel:
- `/api/ubl2.1/invoice` (dentro del middleware auth:api)

## Testing

Puedes probar el endpoint usando:
- **Swagger UI**: `http://localhost:3000/docs`
- **Postman**: Importar la especificación OpenAPI
- **curl**: 
```bash
curl -X POST http://localhost:3000/invoice \
  -H "Content-Type: application/json" \
  -d @factura.json
```

## Timeout y Performance

- **Timeout configurado**: 60 segundos
- **Logging de errores**: Para debugging y monitoreo
- **Validación de respuesta**: Verificación de estructura antes de retornar

## Dependencias

- `@nestjs/axios`: Para realizar llamadas HTTP
- `@nestjs/config`: Para variables de entorno
- `class-validator`: Para validación de DTOs
- `@nestjs/swagger`: Para documentación automática 