# 🏢 API DIAN - Sistema de Gestión Tributaria

API completa para la gestión de empresas y facturación electrónica con la DIAN, construida con **NestJS** siguiendo **Arquitectura Hexagonal** y principios **SOLID**.

## 🏗️ Arquitectura

### Arquitectura Hexagonal (Ports & Adapters)

El proyecto sigue una arquitectura hexagonal que separa claramente las responsabilidades:

```
src/
├── auth/                    # Módulo de Autenticación
│   ├── domain/             # Capa de Dominio
│   │   ├── entities/       # Entidades de negocio
│   │   ├── repositories/   # Interfaces de repositorios
│   │   └── enums/         # Enumeraciones del dominio
│   ├── application/        # Capa de Aplicación
│   │   ├── use-cases/     # Casos de uso
│   │   └── dtos/          # DTOs de entrada/salida
│   └── infrastructure/     # Capa de Infraestructura
│       ├── controllers/    # Controladores HTTP
│       ├── repositories/   # Implementaciones de repositorios
│       ├── guards/        # Guards de autenticación
│       └── strategies/    # Estrategias de autenticación
├── invoice/                # Módulo de Facturación
│   ├── domain/
│   ├── application/
│   └── infrastructure/
├── config/                 # Módulo de Configuración
├── common/                 # Módulo Común
│   ├── filters/           # Filtros de excepciones
│   └── interceptors/      # Interceptores globales
└── main.ts                # Punto de entrada
```

### Principios SOLID Implementados

#### 🔹 Single Responsibility Principle (SRP)
- **Casos de Uso**: Cada caso de uso tiene una única responsabilidad
- **Repositorios**: Cada repositorio maneja una sola entidad
- **Controladores**: Solo manejan HTTP, delegan lógica a casos de uso

#### 🔹 Open/Closed Principle (OCP)
- **Interfaces**: Uso de interfaces para repositorios y servicios
- **Estrategias**: Patrón Strategy para diferentes tipos de autenticación
- **Extensibilidad**: Fácil agregar nuevos casos de uso sin modificar existentes

#### 🔹 Liskov Substitution Principle (LSP)
- **Implementaciones**: Todas las implementaciones respetan sus contratos
- **Polimorfismo**: Uso correcto de herencia e interfaces

#### 🔹 Interface Segregation Principle (ISP)
- **Interfaces específicas**: Interfaces pequeñas y específicas
- **No dependencias innecesarias**: Clientes no dependen de métodos que no usan

#### 🔹 Dependency Inversion Principle (DIP)
- **Inyección de Dependencias**: Uso extensivo de DI de NestJS
- **Abstracciones**: Dependencia de interfaces, no de implementaciones concretas
- **Inversión de control**: Los módulos de alto nivel no dependen de los de bajo nivel

## 🚀 Características

### ✅ Clean Code
- **Nombres descriptivos**: Variables, funciones y clases con nombres claros
- **Funciones pequeñas**: Cada función hace una sola cosa
- **Comentarios útiles**: Documentación donde es necesaria
- **Código autoexplicativo**: Lógica clara y fácil de entender

### ✅ Arquitectura Hexagonal
- **Separación de capas**: Domain, Application, Infrastructure
- **Puertos y Adaptadores**: Interfaces claras entre capas
- **Independencia de frameworks**: Lógica de negocio independiente

### ✅ Swagger Completo
- **Documentación automática**: Generada desde el código
- **Ejemplos detallados**: Requests y responses documentados
- **Autenticación JWT**: Configurada en Swagger UI
- **Tags organizados**: Endpoints agrupados por funcionalidad

### ✅ Principios SOLID
- **Código mantenible**: Fácil de modificar y extender
- **Bajo acoplamiento**: Componentes independientes
- **Alta cohesión**: Responsabilidades bien definidas

## 📋 Endpoints Principales

### 🔐 Autenticación
```
POST /auth/login          # Iniciar sesión
GET  /auth/profile        # Obtener perfil del usuario
```

### 📄 Facturación Electrónica
```
POST /invoice             # Crear nueva factura
GET  /invoice/{number}/status  # Consultar estado de factura
```

### 🏢 Gestión de Compañías
```
POST /companies/external  # Crear compañía en DIAN
GET  /companies          # Listar compañías
```

## 🛠️ Tecnologías

- **NestJS**: Framework principal
- **TypeScript**: Lenguaje de programación
- **TypeORM**: ORM para base de datos
- **MySQL**: Base de datos
- **JWT**: Autenticación
- **Swagger**: Documentación API
- **class-validator**: Validación de DTOs
- **Axios**: Cliente HTTP

## 🔧 Configuración

### Variables de Entorno
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=usuario
DB_PASSWORD=contraseña
DB_DATABASE=dian_db

# JWT
JWT_SECRET=tu_jwt_secret
JWT_EXPIRATION=24h

# Servicio Externo DIAN
EXTERNAL_INVOICE_SERVICE_URL=http://api-dian.com
EXTERNAL_SERVICE_TOKEN=tu_token_dian
```

### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start:dev

# Ejecutar en producción
npm run start:prod
```

## 📚 Documentación API

La documentación completa está disponible en:
- **Desarrollo**: http://localhost:3000/docs
- **Producción**: https://api.soltec.com/docs

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📁 Estructura de Módulos

### Módulo de Facturación (Ejemplo)

```typescript
// Domain Layer
export class Invoice {
  constructor(
    readonly number: string,
    readonly status: InvoiceStatus,
    // ... otros campos
  ) {}
  
  public changeStatus(newStatus: InvoiceStatus): Invoice {
    // Lógica de negocio
  }
}

// Application Layer
@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepositoryInterface,
  ) {}
  
  async execute(dto: CreateInvoiceDto): Promise<Invoice> {
    // Lógica de aplicación
  }
}

// Infrastructure Layer
@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
  ) {}
  
  @Post()
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.createInvoiceUseCase.execute(dto);
  }
}
```

## 🔄 Flujo de Datos

1. **Request** → Controller (Infrastructure)
2. **Controller** → Use Case (Application)
3. **Use Case** → Repository Interface (Domain)
4. **Repository** → External Service (Infrastructure)
5. **Response** ← Controller ← Use Case ← Repository

## 🎯 Beneficios de la Arquitectura

### 🔹 Mantenibilidad
- Código organizado y fácil de entender
- Cambios localizados en capas específicas
- Fácil debugging y testing

### 🔹 Escalabilidad
- Fácil agregar nuevas funcionalidades
- Módulos independientes
- Reutilización de componentes

### 🔹 Testabilidad
- Mocking sencillo de dependencias
- Tests unitarios aislados
- Cobertura completa

### 🔹 Flexibilidad
- Cambio de frameworks sin afectar lógica
- Múltiples adaptadores para misma funcionalidad
- Configuración por ambiente

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📞 Soporte

Para soporte técnico: **soporte@soltec.com**

---

**Desarrollado con ❤️ por el equipo de SolTec**
