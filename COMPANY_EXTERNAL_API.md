# API para Creación de Compañías en Servicio Externo

## Descripción
Este endpoint permite crear una compañía enviando los datos al servicio externo configurado. El NIT y dígito se envían en el body y se usan internamente para construir la URL del servicio externo.

## Configuración

### Variables de Entorno Requeridas
Agregar la siguiente variable al archivo `.env`:

```
EXTERNAL_SERVER_URL=https://url-del-servidor-externo.com
```

## Endpoint

### POST /companies/external

Crear compañía en servicio externo.

#### Body (JSON)
```json
{
  "nit": "901584620",
  "digito": "0",
  "type_document_identification_id": 6,
  "type_organization_id": 1,
  "type_regime_id": 1,
  "type_liability_id": 14,
  "business_name": "GRUPO EMPRESARIAL LUCIO S.A.S.",
  "merchant_registration": "415055",
  "municipality_id": 794,
  "address": "CL 8 3 15 BRR EL TRIUNFO",
  "phone": "3176797045",
  "email": "factgrupoempresariallucio@gmail.com"
}
```

#### Ejemplo de uso
```bash
curl -X POST "http://localhost:3000/companies/external" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "nit": "901584620",
    "digito": "0",
    "type_document_identification_id": 6,
    "type_organization_id": 1,
    "type_regime_id": 1,
    "type_liability_id": 14,
    "business_name": "GRUPO EMPRESARIAL LUCIO S.A.S.",
    "merchant_registration": "415055",
    "municipality_id": 794,
    "address": "CL 8 3 15 BRR EL TRIUNFO",
    "phone": "3176797045",
    "email": "factgrupoempresariallucio@gmail.com"
  }'
```

#### Respuestas

**201 Created - Éxito**
```json
{
  "success": true,
  "message": "Empresa creada/actualizada con éxito",
  "password": "$2y$10$k1/mTpX0FxOpsvrn7nqdZ.XGzuaytLiJ6/QLZxnCZ.wsdGgQOKTR2",
  "token": "f29b7c89df426dd23588f45c384286e44c8a78388cedb0594c276b86815a3a53",
  "company": {
    "id": 1,
    "user_id": 2,
    "identification_number": "901584620",
    "dv": "0",
    "merchant_registration": "415055",
    "address": "CL 8 3 15 BRR EL TRIUNFO",
    "phone": "3176797045",
    "created_at": "2025-06-01 19:29:10",
    "updated_at": "2025-06-01 19:29:10",
    "user": {
      "id": 2,
      "name": "GRUPO EMPRESARIAL LUCIO S.A.S.",
      "email": "factgrupoempresariallucio@gmail.com",
      "created_at": "2025-06-01 19:29:10",
      "updated_at": "2025-06-01 19:29:10"
    }
  }
}
```

**400 Bad Request - Errores de validación del servicio externo**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "type_document_identification_id": [
      "El campo type document identification id es obligatorio."
    ],
    "business_name": [
      "El campo business name es obligatorio."
    ]
  },
  "statusCode": 400
}
```

**400 Bad Request - Errores de validación locales**
```json
{
  "statusCode": 400,
  "message": ["field validation error messages"],
  "error": "Bad Request"
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Error al crear compañía en servicio externo: [detalles del error]"
}
```

## Validaciones

### Validaciones Locales (NestJS)
Los siguientes campos son validados antes de enviar al servicio externo:
- `nit`: Debe ser una cadena de texto (obligatorio)
- `digito`: Debe ser una cadena de texto (obligatorio)
- `type_document_identification_id`: Debe ser un número
- `type_organization_id`: Debe ser un número
- `type_regime_id`: Debe ser un número
- `type_liability_id`: Debe ser un número
- `business_name`: Debe ser una cadena de texto
- `merchant_registration`: Debe ser una cadena de texto
- `municipality_id`: Debe ser un número
- `address`: Debe ser una cadena de texto
- `phone`: Debe ser una cadena de texto
- `email`: Debe ser un email válido

### Validaciones del Servicio Externo
El servicio externo también realiza sus propias validaciones y puede retornar errores específicos por campo. Estos errores se propagan como una respuesta 400 con el formato mostrado arriba.

## Flujo de Procesamiento

1. **Cliente** envía petición a: `POST /companies/external`
2. **API interna** extrae `nit` y `digito` del body
3. **API interna** construye URL: `{EXTERNAL_SERVER_URL}/config/{nit}/{digito}`
4. **API interna** envía el resto de datos al servicio externo
5. **Servicio externo** procesa la petición y responde
6. **API interna** retorna la respuesta al cliente

## Manejo de Errores

### Tipos de Error

1. **Errores de Validación Local**: Ocurren antes de enviar la petición al servicio externo
2. **Errores de Validación Externa**: El servicio externo rechaza los datos
3. **Errores de Conectividad**: No se puede conectar al servicio externo
4. **Errores de Autenticación**: Token JWT inválido o faltante

### Estrategia de Manejo

- Los errores de validación del servicio externo se retornan tal como los envía el servicio
- Los errores de conectividad se transforman en errores 500 con mensaje descriptivo
- Los errores de validación local se manejan por NestJS automáticamente

## Seguridad

- Requiere autenticación JWT (header Authorization: Bearer token)
- Los usuarios deben estar autenticados para acceder al endpoint

## URL del Servicio Externo

El servicio realizará una petición POST a:
```
{EXTERNAL_SERVER_URL}/config/{nit}/{digito}
```

Donde:
- `EXTERNAL_SERVER_URL` es la variable de entorno configurada
- `nit` y `digito` son extraídos del body de la petición

## Casos de Uso Comunes

### Caso Exitoso
1. El cliente envía todos los datos requeridos correctamente (incluyendo nit y digito en el body)
2. La API interna extrae nit y digito para construir la URL del servicio externo
3. El servicio externo procesa y crea/actualiza la empresa
4. Se retorna la información completa incluyendo credenciales

### Caso con Errores de Validación
1. El cliente envía datos incompletos o inválidos
2. El servicio externo rechaza la petición con errores específicos
3. Se retorna una respuesta 400 con los errores detallados por campo 