import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

/**
 * DTOs para el método ConsultarFolios de Nómina Electrónica DIAN
 * Basado en la documentación oficial de The Factory HKA Colombia
 */

export class ConsultarFoliosRequestDto {
  @ApiProperty({ 
    description: 'Token de la empresa suministrado por The Factory HKA Colombia', 
    example: 'token_empresa_demo' 
  })
  @IsString()
  @IsNotEmpty()
  tokenEmpresa: string;

  @ApiProperty({ 
    description: 'Contraseña del token', 
    example: 'password_token' 
  })
  @IsString()
  @IsNotEmpty()
  tokenPassword: string;
}

export class ConsultarFoliosResponseDto {
  @ApiProperty({ 
    description: 'Código de respuesta que indica el estado de la operación', 
    example: 200 
  })
  @IsNumber()
  codigo: number;

  @ApiProperty({ 
    description: 'Mensaje asociado al código, útil para identificación de errores', 
    example: 'Consulta realizada exitosamente' 
  })
  @IsString()
  mensaje: string;

  @ApiProperty({ 
    description: 'Resultado del consumo del método: "Procesado" ó "Error"', 
    example: 'Procesado' 
  })
  @IsString()
  resultado: string;

  @ApiProperty({ 
    description: 'Cantidad de folios disponibles', 
    example: 1000 
  })
  @IsNumber()
  foliosRestantes: number;
} 