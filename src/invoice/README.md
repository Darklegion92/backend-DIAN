# Módulo de Facturas

Este módulo expone endpoints para la gestión de facturas electrónicas que consumen servicios externos de la DIAN.

## Endpoints Disponibles

### POST /invoice
Crea una nueva factura electrónica enviándola al servicio externo.

**Body de ejemplo:**
```json
{
  "number": "FACT001",
  "type_document_id": "01",
  "date": "2025-01-21",
  "time": "10:30:00",
  "notes": "Factura de venta",
  "resolution_number": "18764007051231",
  "prefix": "PREF",
  "customer": {
    "identification_number": "12345678",
    "name": "Cliente Test",
    "email": "cliente@test.com",
    "phone": "3001234567",
    "address": "Calle 123 #45-67"
  },
  "payment_form": {
    "payment_form_id": "1",
    "payment_method_code": "10",
    "payment_due_date": "2025-02-21"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "100000",
    "tax_exclusive_amount": "100000",
    "tax_inclusive_amount": "119000",
    "payable_amount": "119000"
  },
  "tax_totals": [
    {
      "tax_id": "01",
      "tax_amount": "19000",
      "percent": "19",
      "taxable_amount": "100000"
    }
  ],
  "invoice_lines": [
    {
      "unit_measure_id": "94",
      "invoiced_quantity": "1",
      "line_extension_amount": "100000",
      "free_of_charge_indicator": "false",
      "description": "Producto de prueba",
      "code": "PROD001",
      "price_amount": "100000",
      "base_quantity": "1"
    }
  ],
  "sendmail": true,
  "send_customer_credentials": false
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Factura creada exitosamente",
  "data": {
    // Respuesta del servicio externo
  },
  "statusCode": 200
}
```

### GET /invoice/:invoiceNumber/status
Consulta el estado de una factura por su número.

**Parámetros:**
- `invoiceNumber`: Número de la factura a consultar

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "status": "ACCEPTED",
    "cufe": "abc123...",
    // Otros datos del estado
  },
  "statusCode": 200
}
```

## Configuración

Asegúrate de configurar las siguientes variables de entorno:

- `EXTERNAL_INVOICE_SERVICE_URL`: URL del servicio externo de facturas
- `EXTERNAL_SERVICE_TOKEN`: Token de autorización para el servicio externo

## Manejo de Errores

El módulo maneja automáticamente los errores del servicio externo y los transforma en respuestas HTTP apropiadas:

- **400 Bad Request**: Datos de entrada inválidos
- **401 Unauthorized**: Token de autorización inválido
- **404 Not Found**: Factura no encontrada
- **503 Service Unavailable**: Servicio externo no disponible
- **500 Internal Server Error**: Error interno del servidor 