# Corrección: Problema de Validación con FormData

## 🐛 **Problema Identificado**

### Error Original:
```json
{
  "message": ["changeLog must be an array"], 
  "error": "Bad Request", 
  "statusCode": 400
}
```

### Causa Raíz:
Cuando se envían datos a través de `FormData` (multipart/form-data), todos los valores llegan al backend como **strings**, incluso cuando enviamos arrays o booleans.

En el frontend estábamos enviando:
```typescript
formData.append('changeLog', JSON.stringify(versionData.changeLog));
```

Pero el backend esperaba directamente un array:
```typescript
@IsArray()
@IsString({ each: true })
changeLog: string[];
```

## ✅ **Solución Implementada**

### 1. **Transformers en el DTO**

Agregamos transformers usando `class-transformer` para convertir automáticamente los strings de FormData:

```typescript
import { Transform } from 'class-transformer';

export class CreateVersionDto {
  // Para arrays JSON
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  changeLog: string[];

  // Para booleans
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  isLatest?: boolean;
}
```

### 2. **ValidationPipe con Transform**

Agregamos `@UsePipes(new ValidationPipe({ transform: true }))` al endpoint:

```typescript
@Post('versions')
@UsePipes(new ValidationPipe({ transform: true }))
@UseInterceptors(FileInterceptor('file', { /* config */ }))
async uploadVersion(
  @Body() createVersionDto: CreateVersionDto,
  @UploadedFile() file: any
) {
  // ...
}
```

## 🔄 **Cómo Funciona la Transformación**

### **FormData Input (Frontend):**
```javascript
formData.append('changeLog', '["Nuevo sistema", "Mejoras"]');
formData.append('forceUpdate', 'true');
formData.append('isLatest', 'false');
```

### **Transformación (Backend):**
1. **String JSON** → **Array**: `'["item1", "item2"]'` → `['item1', 'item2']`
2. **String Boolean** → **Boolean**: `'true'` → `true`, `'false'` → `false`

### **Resultado Final:**
```typescript
{
  changeLog: ['Nuevo sistema', 'Mejoras'],
  forceUpdate: true,
  isLatest: false
}
```

## 🧪 **Casos de Prueba**

### **Entrada Válida:**
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
    "changeLog": ["Nuevo sistema de errores", "Responsabilidades separadas"],
    "forceUpdate": false,
    "isLatest": true,
    // ... otros campos
  }
}
```

## 🔍 **Validaciones Adicionales**

### **ChangeLog Inválido:**
```bash
# Si envías changeLog malformado
-F 'changeLog=["item sin cerrar'
```
**Resultado:** El transformer devolverá el string tal como está y las validaciones de array fallarán correctamente.

### **Boolean Inválido:**
```bash
# Si envías boolean inválido
-F 'forceUpdate=invalid'
```
**Resultado:** Se convierte a `false` (cualquier string != 'true' se convierte a false).

## 🎯 **Beneficios de la Solución**

1. **Retrocompatibilidad**: Funciona tanto con FormData como con JSON
2. **Robustez**: Maneja errores de parsing gracefully
3. **Simplicidad**: No requiere cambios en el frontend
4. **Estándar**: Usa decorators estándar de NestJS
5. **Mantenibilidad**: Código limpio y documentado

## 🚀 **Resultado**

Ahora el endpoint acepta correctamente:
- ✅ Arrays como strings JSON
- ✅ Booleans como strings ('true'/'false')
- ✅ Validaciones completas de class-validator
- ✅ Transformación automática y transparente

**El error original ya no ocurrirá** y la subida de versiones funcionará correctamente. 