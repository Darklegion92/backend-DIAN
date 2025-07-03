# Corrección del problema de carpeta "undefined" en filePath

## Problema identificado
El filePath aparecía como `uploads\versions\undefined\archivo.exe` porque multer intentaba crear la carpeta usando `req.body.version` antes de que el ValidationPipe procesara el body de la request.

## Causa raíz
En NestJS, los interceptors (como FileInterceptor) se ejecutan antes que los pipes de validación. Por lo tanto, cuando multer intentaba acceder a `req.body.version` para crear el directorio, el valor aún no había sido procesado y resultaba en `undefined`.

## Solución implementada

### 1. Cambio en el controlador
Se modificó la configuración de multer para usar un directorio temporal:

```typescript
// Antes (problemático)
destination: (req, file, cb) => {
  const version = req.body.version; // undefined aquí
  const uploadPath = `uploads/versions/${version}`;
  // ...
}

// Después (corregido)
destination: (req, file, cb) => {
  const tempPath = 'uploads/temp';
  // Crear directorio temporal
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
  }
  cb(null, tempPath);
}
```

### 2. Cambio en el servicio
Se agregó lógica para mover el archivo del directorio temporal al directorio final:

```typescript
// Calcular checksum del archivo temporal
const checksum = await this.calculateChecksumFromFile(tempFilePath);

// Crear directorio de destino
const finalDirectory = `uploads/versions/${createVersionDto.version}`;
if (!fs.existsSync(finalDirectory)) {
  fs.mkdirSync(finalDirectory, { recursive: true });
}

// Mover archivo al directorio final
const finalFilePath = path.join(finalDirectory, file.originalname);
try {
  fs.renameSync(tempFilePath, finalFilePath);
} catch (error) {
  // Fallback para diferentes particiones
  fs.copyFileSync(tempFilePath, finalFilePath);
  fs.unlinkSync(tempFilePath);
}
```

### 3. Manejo de errores
Se agregó limpieza de archivos temporales en caso de errores:

```typescript
try {
  // Lógica de procesamiento
} catch (error) {
  // Limpiar archivos en caso de error
  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath);
  }
  if (finalFilePath && fs.existsSync(finalFilePath)) {
    fs.unlinkSync(finalFilePath);
  }
  throw error;
}
```

## Beneficios de la solución

1. **Corrección del problema**: Elimina la carpeta "undefined" en el filePath
2. **Robustez**: Manejo de errores con limpieza de archivos temporales
3. **Compatibilidad**: Funciona tanto con `fs.renameSync` como con copy/delete para diferentes sistemas de archivos
4. **Orden de ejecución**: Respeta el orden de procesamiento de NestJS (interceptors → pipes)

## Estructura de carpetas resultante
```
uploads/
├── temp/                    # Directorio temporal para uploads
│   └── (archivos temporales durante procesamiento)
└── versions/
    ├── 1.0.0/
    │   └── archivo.exe
    ├── 1.0.1/
    │   └── archivo.exe
    └── ...
```

## Archivos modificados
- `temp/src/system/presentation/controllers/system.controller.ts`
- `temp/src/system/application/services/app-version.service.ts` 