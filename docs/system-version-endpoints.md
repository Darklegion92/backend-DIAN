# Sistema de Gestión de Versiones - API Endpoints

## Descripción General

El sistema de gestión de versiones permite administrar las diferentes versiones de la aplicación, incluyendo la subida de archivos .exe, gestión de metadatos y control de versiones.

## Autenticación

Todos los endpoints requieren autenticación JWT. Incluir el token en el header:
```
Authorization: Bearer {token}
```

## Endpoints Disponibles

### 1. Obtener Versión Actual

**GET** `/system/version`

Retorna la información de la versión más reciente marcada como `isLatest: true`.

#### Respuesta Exitosa (200)
```json
{
  "currentVersion": "1.0.0",
  "downloadUrl": "https://example.com/download/app-v1.0.0.exe",
  "changeLog": [
    "Versión inicial del sistema",
    "Funcionalidades básicas implementadas",
    "Sistema de autenticación JWT"
  ],
  "forceUpdate": false,
  "releaseDate": "2024-01-15",
  "fileSize": 52428800,
  "checksum": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
}
```

#### Respuesta de Error (404)
```json
{
  "statusCode": 404,
  "message": "No hay versiones disponibles"
}
```

---

### 2. Obtener Todas las Versiones

**GET** `/system/versions`

Retorna todas las versiones activas ordenadas por fecha de creación (más recientes primero).

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "version": "1.0.0",
      "downloadUrl": "https://example.com/download/app-v1.0.0.exe",
      "changeLog": ["Versión inicial del sistema"],
      "forceUpdate": false,
      "releaseDate": "2024-01-15",
      "fileSize": 52428800,
      "checksum": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      "fileName": "app-v1.0.0.exe",
      "isActive": true,
      "isLatest": true,
      "description": "Primera versión estable",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Subir Nueva Versión

**POST** `/system/versions`

Sube un archivo .exe y crea una nueva versión de la aplicación.

#### Content-Type
`multipart/form-data`

#### Parámetros del Formulario
- `file` (archivo): Archivo .exe de la aplicación
- `version` (string): Número de versión (ej: "1.0.1")
- `changeLog` (string[]): Lista de cambios en formato JSON
- `forceUpdate` (boolean, opcional): Si la actualización es obligatoria
- `releaseDate` (string): Fecha de lanzamiento en formato YYYY-MM-DD
- `description` (string, opcional): Descripción de la versión
- `isLatest` (boolean, opcional): Si esta es la versión más reciente

#### Ejemplo de Solicitud
```bash
curl -X POST \
  http://localhost:3000/system/versions \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@app-v1.0.1.exe' \
  -F 'version=1.0.1' \
  -F 'changeLog=["Corrección de errores", "Mejoras de rendimiento"]' \
  -F 'forceUpdate=false' \
  -F 'releaseDate=2024-01-20' \
  -F 'description=Versión con correcciones importantes' \
  -F 'isLatest=true'
```

#### Respuesta Exitosa (201)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Versión creada exitosamente",
  "data": {
    "id": 2,
    "version": "1.0.1",
    "downloadUrl": "/system/download/1.0.1",
    "changeLog": ["Corrección de errores", "Mejoras de rendimiento"],
    "forceUpdate": false,
    "releaseDate": "2024-01-20",
    "fileSize": 52428800,
    "checksum": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1",
      "fileName": "app-v1.0.1.exe",
  "filePath": "uploads/versions/1.0.1/app-v1.0.1.exe",
    "isActive": true,
    "isLatest": true,
    "description": "Versión con correcciones importantes",
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

#### Respuesta de Error (400)
```json
{
  "statusCode": 400,
  "message": "La versión 1.0.1 ya existe"
}
```

---

### 4. Marcar Versión como Más Reciente

**PUT** `/system/versions/{version}/latest`

Establece una versión específica como la más reciente (isLatest: true).

#### Parámetros de Ruta
- `version` (string): Número de versión a marcar como más reciente

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Versión 1.0.1 establecida como la más reciente"
}
```

#### Respuesta de Error (404)
```json
{
  "statusCode": 404,
  "message": "Versión 1.0.1 no encontrada"
}
```

---

### 5. Eliminar Versión

**DELETE** `/system/versions/{id}`

Desactiva una versión específica (eliminación lógica).

#### Parámetros de Ruta
- `id` (number): ID de la versión a eliminar

#### Respuesta Exitosa (200)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Versión eliminada exitosamente"
}
```

---

### 6. Descargar Archivo de Versión

**GET** `/system/download/{version}`

Descarga el archivo .exe de una versión específica.

#### Parámetros de Ruta
- `version` (string): Número de versión a descargar

#### Respuesta Exitosa (200)
Retorna el archivo .exe como stream de datos con headers:
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="app-v1.0.0.exe"
```

#### Respuesta de Error (404)
```json
{
  "statusCode": 404,
  "message": "Archivo no encontrado"
}
```

---

## Estructura de Base de Datos

### Tabla: app_versions

```sql
CREATE TABLE app_versions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  version VARCHAR(20) UNIQUE NOT NULL,
  downloadUrl VARCHAR(500) NOT NULL,
  changeLog JSON NOT NULL,
  forceUpdate BOOLEAN DEFAULT FALSE,
  releaseDate DATE NOT NULL,
  fileSize BIGINT NOT NULL,
  checksum VARCHAR(255) NOT NULL,
  fileName VARCHAR(255),
  filePath VARCHAR(255),
  isActive BOOLEAN DEFAULT TRUE,
  isLatest BOOLEAN DEFAULT FALSE,
  description VARCHAR(500),
  createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
```

## Validaciones

### Archivo .exe
- Solo se aceptan archivos con extensión `.exe`
- MIME type: `application/x-msdownload`
- El archivo se almacena en `uploads/versions/{version}/`

### Versión
- Debe ser única en el sistema
- Formato recomendado: semantic versioning (ej: 1.0.0, 1.2.3-beta)

### Checksum
- Se calcula automáticamente usando SHA-256
- Se usa para verificar la integridad del archivo

## Casos de Uso Comunes

### 1. Verificar si hay actualizaciones disponibles
```bash
GET /system/version
```

### 2. Subir nueva versión
```bash
POST /system/versions
# Con archivo .exe y metadatos
```

### 3. Marcar una versión como crítica
```bash
PUT /system/versions/1.0.1/latest
# Luego actualizar forceUpdate en base de datos si es necesario
```

### 4. Descargar versión específica
```bash
GET /system/download/1.0.1
```

## Notas Importantes

1. **Autenticación**: Todos los endpoints requieren token JWT válido
2. **Almacenamiento**: Los archivos se guardan en `uploads/versions/{version}/`
3. **Eliminación**: Las versiones se eliminan lógicamente (isActive: false)
4. **Versión Única**: Solo puede haber una versión marcada como `isLatest: true`
5. **Checksum**: Se calcula automáticamente para verificar integridad del archivo 