# Corrección: Error de Cálculo de Checksum

## 🐛 **Problema Identificado**

### Error Original:
```
[Nest] 10364  - 02/07/2025, 7:16:04 a. m.   ERROR [ExceptionsHandler] The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined    
TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
    at Hash.update (node:internal/crypto/hash:115:11)
    at AppVersionService.calculateChecksum (D:\projects\soltec\DIAN\temp\src\system\application\services\app-version.service.ts:99:40)
    at AppVersionService.createNewVersion (D:\projects\soltec\DIAN\temp\src\system\application\services\app-version.service.ts:43:27)
```

### Causa Raíz:
El problema ocurría porque estábamos usando **`diskStorage`** de multer, que guarda los archivos directamente en disco **sin mantener el buffer en memoria**. Cuando intentábamos acceder a `file.buffer`, este era `undefined`.

```typescript
// ❌ PROBLEMA: file.buffer es undefined con diskStorage
const checksum = this.calculateChecksum(file.buffer); // undefined!
```

## ✅ **Solución Implementada**

### **1. Cambio en el Servicio**

#### **Antes (❌ Error):**
```typescript
async createNewVersion(createVersionDto: CreateVersionDto, file: any): Promise<AppVersion> {
  // ...
  
  // ❌ file.buffer es undefined con diskStorage
  const checksum = this.calculateChecksum(file.buffer);
  
  // ❌ Path construido manualmente
  newVersion.filePath = `uploads/versions/${createVersionDto.version}/${file.originalname}`;
  
  // ...
}

private calculateChecksum(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
```

#### **Después (✅ Corregido):**
```typescript
async createNewVersion(createVersionDto: CreateVersionDto, file: any): Promise<AppVersion> {
  // ...
  
  // ✅ Usar la ruta real del archivo guardado por multer
  const filePath = file.path;
  
  // ✅ Calcular checksum leyendo desde disco
  const checksum = await this.calculateChecksumFromFile(filePath);
  
  // ✅ Usar la ruta real del archivo
  newVersion.filePath = filePath;
  
  // ...
}

// ✅ Nuevo método que lee el archivo desde disco
private async calculateChecksumFromFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => {
      hash.update(data);
    });
    
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    
    stream.on('error', (error) => {
      reject(error);
    });
  });
}
```

### **2. Importación Agregada**
```typescript
import * as fs from 'fs'; // Para leer archivos desde disco
```

## 🔄 **Cómo Funciona la Nueva Implementación**

### **Flujo del Archivo:**
1. **Frontend** sube archivo → **Multer** con `diskStorage`
2. **Multer** guarda archivo en `uploads/versions/{version}/archivo.exe`
3. **Multer** proporciona `file.path` con la ruta completa
4. **Servicio** lee el archivo desde disco usando `fs.createReadStream`
5. **Cálculo** de checksum SHA-256 usando streams
6. **Resultado** almacenado en base de datos

### **Ventajas de la Solución:**
- ✅ **Eficiente**: Usa streams para archivos grandes
- ✅ **Confiable**: Lee el archivo realmente guardado
- ✅ **Asíncrono**: No bloquea el hilo principal
- ✅ **Manejo de errores**: Promesas con catch de errores
- ✅ **Path real**: Usa la ruta exacta donde multer guardó el archivo

## 🧪 **Validación de la Corrección**

### **Test Manual:**
```bash
curl -X POST http://localhost:3000/system/versions \
  -H "Authorization: Bearer TOKEN" \
  -F 'file=@app-v2.0.0.exe' \
  -F 'version=2.0.0' \
  -F 'changeLog=["Nuevo sistema de errores", "Responsabilidades separadas"]' \
  -F 'forceUpdate=false' \
  -F 'releaseDate=2025-07-02' \
  -F 'description=Versión destinada a cambiar la lógica de negocio' \
  -F 'isLatest=true'
```

### **Respuesta Esperada:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Versión creada exitosamente",
  "data": {
    "id": 2,
    "version": "2.0.0",
    "checksum": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4e5f6g7h8i9j0k1l2",
    "filePath": "uploads/versions/2.0.0/app-v2.0.0.exe",
    "fileSize": 52428800,
    // ... otros campos
  }
}
```

## 🎯 **Diferencias Clave**

| Aspecto | Antes (❌) | Después (✅) |
|---------|------------|--------------|
| **Origen de datos** | `file.buffer` (undefined) | `file.path` (ruta real) |
| **Lectura** | Memoria (no disponible) | Disco (stream) |
| **Método** | `calculateChecksum()` | `calculateChecksumFromFile()` |
| **Tipo** | Síncrono | Asíncrono (Promise) |
| **Manejo de archivos grandes** | Problemático | Eficiente (streams) |

## 🚀 **Resultado**

- ✅ **El error de checksum está corregido**
- ✅ **Los archivos se procesan correctamente**
- ✅ **El sistema calcula checksums SHA-256 válidos**
- ✅ **Compatible con archivos .exe grandes**
- ✅ **Manejo robusto de errores**

El sistema ahora puede subir versiones sin el error de `TypeError [ERR_INVALID_ARG_TYPE]`. 