import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSoftwareDto } from '@/software/presentation/dtos/create-software.dto';
import { SoftwareService } from '@/software/application/services/software.service';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { SoftwareResponseDto } from '../dtos/software-response.dto';

@ApiTags('Software')
@Controller('software')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Post('')
  @ApiOperation({
    summary: 'Crear software en servicio externo',
    description: 'Crea o actualiza un software en el servicio externo de la DIAN. Solo accesible para ADMIN y DEALER.',
  })
  @ApiResponse({
    status: 201,
    description: 'Software creado/actualizado exitosamente',
    type: SoftwareResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación requerido',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor o del servicio externo',
  })
  async createSoftware(
    @Body() createSoftwareDto: CreateSoftwareDto,
  ): Promise<SoftwareResponseDto> {
    return this.softwareService.createSoftware(createSoftwareDto);
  }
} 