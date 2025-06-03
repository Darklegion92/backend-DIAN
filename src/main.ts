import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: [
      'http://localhost:8000', // Frontend en desarrollo
      'http://31.97.134.241', // Por si hay otros servicios
      'https://facturador.tecnologiaydesarrollo.net',
      'http://facturador.tecnologiaydesarrollo.net'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true, // Permitir cookies y headers de autorización
  });

  // Configurar ValidationPipe globalmente con transformación automática
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
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
      - **POST /companies/external**: Crear nueva compañía en servicio DIAN
      - **GET /companies**: Listar compañías con paginación
      - **POST /invoice**: Crear facturas electrónicas
      - **GET /invoice/{number}/status**: Consultar estado de facturas
      
      ## 🌐 Ambientes
      - **Desarrollo**: API de pruebas de la DIAN
      - **Producción**: API oficial de la DIAN
      
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
    .addTag('companies', '🏢 Gestión de Compañías - Crear y administrar empresas')
    .addTag('invoice', '📄 Facturación Electrónica - Generar facturas DIAN')
    .addTag('auth', '🔐 Autenticación - Login y gestión de tokens')
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .addServer('http://http://facturador.tecnologiaydesarrollo.net:3000/api', 'Servidor de Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'API DIAN - Documentación',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1976d2; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 15px; border-radius: 4px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  });

  // También mantener el endpoint /api para compatibilidad
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`🚀 Aplicación corriendo en: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Documentación Swagger: http://localhost:${process.env.PORT ?? 3000}/docs`);
  console.log(`📋 API alternativa: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
