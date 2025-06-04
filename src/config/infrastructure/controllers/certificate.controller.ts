import {
  Controller,
  Put,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { CertificateService } from '../../application/services/certificate.service';
import { CreateCertificateDto } from '../../application/dto/create-certificate.dto';
import { CertificateResponseDto } from '../../application/dto/certificate-response.dto';

@ApiTags('Certificados')
@Controller('certificate')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Put('')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  @ApiOperation({
    summary: 'Crear certificado',
    description: `
      Crea un nuevo certificado enviando los datos al servicio externo configurado.
      Solo accesible para ADMIN y DEALER.
      
      El endpoint requiere:
      - Autenticación con Bearer Token (JWT) en el header
      - Certificado en formato base64 en el body
      - Contraseña del certificado en el body
      - Bearer token para el servicio externo en el body
      
      El bearer token del body se reenvía al servicio externo para autenticación.
      Después guarda la información del certificado en la base de datos local.
    `,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Certificado creado exitosamente',
    type: CertificateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'El certificado es requerido',
            'La contraseña es requerida',
            'El bearer token es requerido',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor o del servicio externo',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Error del servicio externo: mensaje de error',
        },
      },
    },
  })
  async createCertificate(
    @Body() createCertificateDto: CreateCertificateDto,
  ): Promise<CertificateResponseDto> {
    return this.certificateService.createCertificate(createCertificateDto);
  }
} 