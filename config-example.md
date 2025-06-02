# Configuración del Módulo de Facturas Externas

## Variables de Entorno Requeridas

Para que el módulo de facturas funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

```bash
# URL del servicio externo Laravel (apidian2025)
EXTERNAL_SERVER_URL=http://localhost:8000/api

# Configuración de base de datos (si es necesario)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=dian_backend

# Configuración JWT
JWT_SECRET=tu_jwt_secret_aqui
JWT_EXPIRES_IN=1d

# Puerto de la aplicación NestJS
PORT=3000

# Entorno
NODE_ENV=development
```

## Autenticación Requerida

**⚠️ IMPORTANTE:** Este módulo requiere un token de autenticación válido del sistema Laravel.

### Obtener Token de Autenticación

Antes de usar el endpoint de facturas, debes obtener un token del sistema Laravel:

```bash
# Ejemplo de login en Laravel para obtener token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@empresa.com",
    "password": "password123"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "access_token": "tu_token_bearer_aqui",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Endpoints Disponibles del Servicio Externo

El módulo NestJS está configurado para consumir los siguientes endpoints del proyecto Laravel:

### 1. Crear Factura (con autenticación)
- **URL**: `POST {EXTERNAL_SERVER_URL}/invoice`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: Datos de la factura completa

## Configuración de CORS (si es necesario)

Si el servicio Laravel está en un dominio diferente, asegúrate de configurar CORS adecuadamente en el proyecto Laravel.

## Testing

Puedes probar los endpoints usando la documentación Swagger disponible en:
- http://localhost:3000/docs
- http://localhost:3000/api

### Ejemplo con curl:

```bash
curl -X POST http://localhost:3000/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "token": "tu_token_bearer_aqui",
    "type_document_id": 1,
    "number": 1001,
    "prefix": "FE",
    "customer": {
      "identification_number": "12345678",
      "first_name": "Juan",
      "family_first_surname": "Pérez",
      "email": "juan@email.com"
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
        "description": "Producto ejemplo",
        "price_amount": 100000
      }
    ]
  }'
```

## Ejemplo de Uso

```typescript
// Ejemplo de cómo usar el servicio en otros módulos
import { ExternalInvoiceService } from './invoice/domain/services/external-invoice.service';

@Injectable()
export class MiServicio {
  constructor(
    private readonly externalInvoiceService: ExternalInvoiceService
  ) {}

  async crearFactura(datos: CreateInvoiceRequest, token: string) {
    return await this.externalInvoiceService.createInvoice(datos, token);
  }
}
```

## Estructura de Respuestas

Todas las respuestas siguen el formato estándar:

```json
{
  "success": boolean,
  "message": string,
  "data": {
    "success": boolean,
    "cufe": string,
    "QRStr": string,
    "urlinvoicexml": string,
    "urlinvoicepdf": string,
    "ResponseDian": object,
    // ... más campos de respuesta de Laravel
  }
}
```

## Manejo de Errores

El servicio maneja automáticamente:
- **401 Unauthorized**: Token inválido o expirado
- **400 Bad Request**: Errores de validación 
- **408 Request Timeout**: Timeout del servicio externo
- **500 Internal Server Error**: Errores del servidor Laravel
- **503 Service Unavailable**: Servicio Laravel no disponible

## Seguridad

- ✅ **Autenticación Bearer**: Todos los requests requieren token válido
- ✅ **Validación de datos**: Validación estricta antes de enviar a Laravel
- ✅ **Timeout configurado**: Evita requests infinitos
- ✅ **Logging de errores**: Para monitoreo y debugging 