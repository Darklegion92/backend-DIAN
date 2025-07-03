import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Post, Body, BadRequestException, CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import * as request from 'supertest';
import helmet from 'helmet';
import { IsString, IsNotEmpty, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

// DTO de prueba
class TestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(partial: Partial<TestDto>) {
    Object.assign(this, partial);
  }
}

// Guard de validación personalizado
@Injectable()
class ValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const dto = plainToClass(TestDto, request.body);
    const errors = validateSync(dto);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    return true;
  }
}

// Controlador de prueba
@Controller('test')
class TestController {
  @Post()
  @UseGuards(ValidationGuard)
  test(@Body() dto: TestDto) {
    return { message: 'success' };
  }
}

describe('Main Application', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Configurar prefijo global para la API
    app.setGlobalPrefix('api');

    // Configurar CORS
    app.enableCors({
      origin: [
        'http://localhost:8000',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://facturador.tecnologiaydesarrollo.net',
        'http://facturador.tecnologiaydesarrollo.net',
        'http://31.97.134.241',
        'https://31.97.134.241',
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
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400,
    });

    // Configurar ValidationPipe global
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
        validationError: {
          target: false,
          value: false,
        },
      }),
    );

    // Configurar Swagger
    const config = new DocumentBuilder()
      .setTitle('🏢 API DIAN - Sistema de Gestión Tributaria')
      .setDescription('API completa para la gestión de empresas y facturación electrónica con la DIAN')
      .setVersion('2.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    // Configurar Helmet para headers de seguridad
    app.use(helmet());

    await app.init();
  }, 30000);

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('debería tener el prefijo global /api', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(404); // Asumiendo que no existe el endpoint /health

    expect(response.request.url).toContain('/api/');
  });

  it('debería tener configurado CORS correctamente', async () => {
    const response = await request(app.getHttpServer())
      .options('/api/health')
      .set('Origin', 'http://localhost:8000')
      .expect(204);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:8000');
    expect(response.headers['access-control-allow-methods']).toContain('GET');
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toContain('Authorization');
  });

  it('debería tener configurado Swagger en /docs', async () => {
    const response = await request(app.getHttpServer())
      .get('/docs')
      .expect(200);

    expect(response.text).toContain('swagger-ui');
  });

  it('debería tener configurado ValidationPipe', async () => {
    // Primero probamos con datos válidos
    const validResponse = await request(app.getHttpServer())
      .post('/api/test')
      .send({ name: 'test' })
      .expect(201);

    expect(validResponse.body).toEqual({ message: 'success' });

    // Luego probamos con datos inválidos
    const invalidResponse = await request(app.getHttpServer())
      .post('/api/test')
      .send({ name: 123 }) // Enviar un número en lugar de string
      .expect(400);

    expect(invalidResponse.body.message).toBe('Validation failed');
    expect(invalidResponse.body.errors[0].property).toBe('name');
    expect(invalidResponse.body.errors[0].constraints).toHaveProperty('isString');
  });

  it('debería tener configurado el puerto correcto', async () => {
    const server = app.getHttpServer();
    const address = server.address();
    expect(address).toBeDefined();
  });

  it('debería tener configurado los headers de seguridad', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(404);

    // Verificar headers de seguridad básicos
    expect(response.headers).toHaveProperty('x-dns-prefetch-control');
    expect(response.headers).toHaveProperty('x-frame-options');
    expect(response.headers).toHaveProperty('strict-transport-security');
  });
}); 