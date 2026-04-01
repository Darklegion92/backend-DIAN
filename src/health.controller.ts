import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Salud')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar el estado de salud de la aplicación' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nestjs-backend'
    };
  }
}
