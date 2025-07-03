# Generación de Nombres Únicos para Archivos

## Problema Identificado
Los archivos se podían sobreescribir cuando se subían múltiples versiones con el mismo nombre de archivo, causando pérdida de datos y conflictos en el almacenamiento.

## Solución Implementada

### 1. Generación de Nombres Únicos
Se implementó un método que genera nombres únicos combinando:
- Nombre base del archivo original
- Timestamp actual
- UUID único

```typescript
private generateUniqueFileName(originalName: string): string {
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  const uuid = randomUUID();
  const timestamp = Date.now();
  
  // Formato: baseName_timestamp_uuid.extension
  return `${baseName}_${timestamp}_${uuid}${extension}`;
}
```

### 2. Estructura de Archivos Generados
**Formato**: `nombreOriginal_timestamp_uuid.extension`

**Ejemplo**:
- Archivo original: `Integrate-DIAN.exe`
- Archivo único: `Integrate-DIAN_1704234567890_f47ac10b-58cc-4372-a567-0e02b2c3d479.exe`

### 3. Almacenamiento Dual de Nombres
Se mantienen dos campos en la base de datos:

```typescript
// Nombre único generado (para almacenamiento interno)
fileName: string;

// Nombre original del archivo (para referencia del usuario)
originalFileName: string;
```

### 4. Experiencia del Usuario
- **Subida**: El usuario sube un archivo con su nombre original
- **Almacenamiento**: Se genera un nombre único internamente
- **Descarga**: El usuario descarga con el nombre original
- **Referencia**: En las vistas se muestra el nombre original

### 5. Migración de Base de Datos
Se creó un script para agregar la nueva columna:

```sql
ALTER TABLE app_versions 
ADD COLUMN originalFileName VARCHAR(255) NULL
AFTER fileName;

UPDATE app_versions 
SET originalFileName = fileName 
WHERE originalFileName IS NULL;
```

## Beneficios

### 1. **Prevención de Sobreescritura**
- Cada archivo tiene un nombre único garantizado
- No hay pérdida de datos por conflictos de nombres

### 2. **Trazabilidad**
- Cada archivo es identificable únicamente
- Historial completo de versiones sin conflictos

### 3. **Experiencia de Usuario**
- El usuario ve siempre el nombre original familiar
- Transparencia total en la descarga

### 4. **Escalabilidad**
- Soporte para múltiples versiones con el mismo nombre base
- Sistema robusto para equipos grandes

## Estructura Final de Carpetas

```
uploads/
├── temp/                                    # Archivos temporales
└── versions/
    ├── 1.0.0/
    │   ├── Integrate-DIAN_1704234567890_uuid1.exe
    │   └── Another-App_1704234567891_uuid2.exe
    ├── 1.0.1/
    │   ├── Integrate-DIAN_1704234567892_uuid3.exe
    │   └── Update-Tool_1704234567893_uuid4.exe
    └── ...
```

## Compatibilidad con Versiones Anteriores

### Migración Automática
- Archivos existentes mantienen funcionalidad completa
- Campo `originalFileName` se rellena con valor de `fileName` existente
- Sin interrupciones en el servicio

### Descarga Inteligente
```typescript
// Prioriza el nombre original, fallback al nombre único
filename="${appVersion.originalFileName || appVersion.fileName}"
```

## Archivos Modificados

### Backend
- `temp/src/system/domain/entities/app-version.entity.ts` - Nueva columna originalFileName
- `temp/src/system/application/services/app-version.service.ts` - Método generateUniqueFileName
- `temp/src/system/presentation/controllers/system.controller.ts` - Descarga con nombre original
- `temp/src/system/presentation/dtos/version-response.dto.ts` - Campos adicionales en respuesta

### Base de Datos
- `temp/database/add-original-filename-column.sql` - Script de migración

## Consideraciones de Seguridad

### 1. **Nombres Seguros**
- UUIDs criptográficamente seguros
- Timestamps para ordenamiento temporal
- Extensiones preservadas para validación

### 2. **Prevención de Ataques**
- No se puede predecir el nombre generado
- Protección contra directory traversal
- Validación de extensiones mantenida

## Casos de Uso Resueltos

### 1. **Múltiples Versiones del Mismo Archivo**
```
v1.0.0: app.exe → app_1704234567890_uuid1.exe
v1.0.1: app.exe → app_1704234567891_uuid2.exe
v1.1.0: app.exe → app_1704234567892_uuid3.exe
```

### 2. **Subidas Simultáneas**
- Diferentes usuarios pueden subir el mismo archivo sin conflictos
- Cada timestamp y UUID garantiza unicidad

### 3. **Rollbacks y Restauraciones**
- Todas las versiones históricas permanecen intactas
- Fácil identificación por timestamp

Esta implementación asegura la integridad de los datos y una experiencia de usuario óptima. 