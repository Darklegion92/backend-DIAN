# Variables de Entorno Requeridas

## Archivo .env

Crea un archivo `.env` en el directorio `backend/` con las siguientes variables:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_contraseña_db
DB_DATABASE=nombre_base_datos

# Configuración JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_segura
JWT_EXPIRATION=1d

# Configuración del servidor externo para creación de compañías y certificados
# Esta es la URL base del servicio externo que maneja las compañías
# El endpoint completo será: {EXTERNAL_SERVER_URL}/config/{nit}/{digito}
EXTERNAL_SERVER_URL=https://url-del-servidor-externo.com

# Puerto de la aplicación
PORT=3000

# Entorno de ejecución
NODE_ENV=development
```

## Descripción de Variables

### Base de Datos
- **DB_HOST**: Dirección del servidor MySQL (normalmente `localhost`)
- **DB_PORT**: Puerto de MySQL (normalmente `3306`)
- **DB_USERNAME**: Usuario de la base de datos
- **DB_PASSWORD**: Contraseña del usuario de la base de datos
- **DB_DATABASE**: Nombre de la base de datos

### JWT (Autenticación)
- **JWT_SECRET**: Clave secreta para firmar los tokens JWT (debe ser muy segura)
- **JWT_EXPIRATION**: Tiempo de expiración de los tokens (ej: `1d`, `24h`, `3600s`)

### Servicio Externo
- **EXTERNAL_SERVER_URL**: URL base del servicio externo para crear compañías y certificados
  - Ejemplo: `https://api.externos.com`
  - Endpoint compañías: `https://api.externos.com/config/901584620/0`
  - Endpoint certificados: `https://api.externos.com/config/certificate`

### Aplicación
- **PORT**: Puerto donde correrá la aplicación (opcional, por defecto 3000)
- **NODE_ENV**: Entorno de ejecución (`development`, `production`, `test`)

## Ejemplo Específico para Desarrollo

```env
# Base de datos local
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password123
DB_DATABASE=dian_db

# JWT con clave segura
JWT_SECRET=mi_super_clave_secreta_para_jwt_2024_muy_larga_y_segura
JWT_EXPIRATION=24h

# Servicio externo (reemplaza con la URL real)
EXTERNAL_SERVER_URL=https://api.servicioexterno.com

# Configuración local
PORT=3000
NODE_ENV=development
```

## Uso del Servicio Externo

### Para Compañías

#### Endpoint
```
POST {EXTERNAL_SERVER_URL}/config/{nit}/{digito}
```

#### Ejemplo con URL configurada
Si `EXTERNAL_SERVER_URL=https://api.externos.com`, el endpoint será:
```
POST https://api.externos.com/config/901584620/0
```

#### Body de la petición
```json
{
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

### Para Certificados

#### Endpoint local
```
PUT /config/certificate
```

#### Headers requeridos
```
Authorization: Bearer {JWT_TOKEN_DE_AUTENTICACION}
Content-Type: application/json
```

#### Body de la petición
```json
{
  "certificate": "MIACAQMwgAYJKoZIhvcNAQcBoIAkgASCA+gwgDCABgkqhkiG9...",
  "password": "bFOGqscdpZQlQWkd",
  "bearerToken": "token_para_el_servicio_externo"
}
```

#### Comunicación con servicio externo
El sistema internamente hace una petición al servicio externo:

**Endpoint externo:**
```
PUT {EXTERNAL_SERVER_URL}/config/certificate
```

**Headers enviados al servicio externo:**
```
Authorization: Bearer {bearerToken_del_body}
Content-Type: application/json
```

**Body enviado al servicio externo:**
```json
{
  "certificate": "MIACAQMwgAYJKoZIhvcNAQcBoIAkgASCA+gwgDCABgkqhkiG9...",
  "password": "bFOGqscdpZQlQWkd"
}
```

#### Respuesta esperada
```json
{
  "success": true,
  "message": "Certificado creado con éxito",
  "certificado": {
    "name": "9015846200.p12",
    "password": "bFOGqscdpZQlQWkd",
    "expiration_date": "2025/05/21 07:04:32",
    "updated_at": "2025-06-01 20:51:35",
    "created_at": "2025-06-01 20:51:35",
    "id": 1
  }
}
```

## Seguridad

⚠️ **Importante**: 
- Nunca subas el archivo `.env` al repositorio
- Usa variables seguras para `JWT_SECRET`
- El `bearerToken` para el servicio externo debe ser proporcionado por el cliente en cada petición
- Verifica que `EXTERNAL_SERVER_URL` apunte al servidor correcto
- En producción, usa variables de entorno del sistema en lugar del archivo `.env`

## Verificación

Para verificar que las variables están configuradas correctamente:

1. Crea el archivo `.env` con las variables
2. Arranca la aplicación: `npm run start:dev`
3. Verifica en los logs que no hay errores de conexión
4. Prueba el endpoint de crear compañía externa 
5. Prueba el endpoint de crear certificado con un bearer token válido 