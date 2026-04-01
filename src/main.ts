import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'], // Habilitar logs para diagnóstico en producción
  });

  // Aumentar el límite del body a 10MB para peticiones grandes (ej. imágenes base64)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Configurar prefijo global para la API (compatible con Apache)
  app.setGlobalPrefix('api');

  // Configurar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: [
      // URLs de desarrollo
      'http://localhost:8000', // Frontend en desarrollo
      'http://localhost:3000', // Swagger local
      'http://localhost:3001', // Posible frontend alternativo
      
      // URLs de producción
      'https://facturador.tecnologiaydesarrollo.net', // HTTPS Principal
      'http://facturador.tecnologiaydesarrollo.net',  // HTTP (será redirigido)
      'http://31.97.134.241', // IP del servidor
      'https://31.97.134.241', // IP del servidor con HTTPS
      
      // Permitir cualquier subdominio de tecnologiaydesarrollo.net
      /^https?:\/\/.*\.tecnologiaydesarrollo\.net$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'X-API-KEY',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'Content-Range',
    ],
    credentials: true, // Permitir cookies y headers de autorización
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // Cache preflight por 24 horas
  });

  // Configurar ValidationPipe globalmente con transformación automática
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: false, // Deshabilitado para evitar conversión incorrecta de booleanos
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('🏢 API DIAN - Sistema de Gestión Tributaria')
    .setDescription(`
      **API completa para la gestión de empresas y facturación electrónica con la DIAN**
      
      Esta API proporciona endpoints para:
      - 🏢 **Gestión de Compañías**: Crear y administrar empresas en el sistema DIAN
      - 📄 **Facturación Electrónica**: Generar y gestionar facturas electrónicas
      - 👥 **Gestión de Usuarios**: Autenticación y autorización
      - 📊 **Consultas**: Obtener información de estados y reportes
      
      ## 🔐 Autenticación
      Todos los endpoints requieren autenticación JWT. Use el botón "Authorize" para configurar su token.
      
      ## 📋 Endpoints Principales
      - **POST /api/companies/external**: Crear nueva compañía en servicio DIAN
      - **GET /api/companies**: Listar compañías con paginación
      - **POST /api/invoice**: Crear facturas electrónicas
      - **GET /api/invoice/{number}/status**: Consultar estado de facturas
      
      ## 🌐 Ambientes
      - **Desarrollo**: API de pruebas de la DIAN
      - **Producción**: API oficial de la DIAN
      
      ## 🔒 Seguridad
      - Todas las comunicaciones usan HTTPS en producción
      - Autenticación JWT con tokens seguros
      - Headers de seguridad implementados
      
      ## 📞 Soporte
      Para soporte técnico: soporte@soltec.com
    `)
    .setVersion('2.0')
    .setContact(
      'Equipo Soltec', 
      'https://www.soltec.com', 
      'soporte@soltec.com'
    )
    .setLicense(
      'Licencia Propietaria', 
      'https://www.soltec.com/license'
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Ingrese su token JWT obtenido del endpoint de login',
      in: 'header',
    })
    .addServer('http://localhost:3000', 'Servidor de Desarrollo Local')
    .addServer('https://facturador.tecnologiaydesarrollo.net', 'Servidor de Producción (HTTPS)')
    .addServer('http://facturador.tecnologiaydesarrollo.net', 'Servidor de Producción (HTTP - Redirige a HTTPS)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Swagger en /docs (fuera del prefijo /api)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'API DIAN - Documentación',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1976d2; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 15px; border-radius: 4px; }
      .swagger-ui .info .description { max-width: 100%; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`🚀 Aplicación corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación Swagger: http://localhost:${process.env.PORT ?? 3000}/docs`);
  console.log(`🔗 API Base URL: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`🔒 Producción HTTPS: https://facturador.tecnologiaydesarrollo.net/api`);
}
bootstrap();
