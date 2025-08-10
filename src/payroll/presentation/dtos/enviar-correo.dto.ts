import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator';

/**
 * DTOs para el método EnviarCorreo de Nómina Electrónica DIAN
 * Basado en la documentación oficial de The Factory HKA Colombia
 */

export class EnviarCorreoRequestDto {
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

  @ApiProperty({ 
    description: 'Dirección de correo electrónico del empleado', 
    example: 'juan.perez@email.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Prefijo y Consecutivo del Documento electrónico concatenado sin separadores', 
    example: 'PRUE980338212' 
  })
  @IsString()
  @IsNotEmpty()
  consecutivoDocumentoNom: string;
}

export class EnviarCorreoResponseDto {
  @ApiProperty({ 
    description: 'Código de respuesta que indica el estado de la operación', 
    example: 200 
  })
  @IsNumber()
  codigo: number;

  @ApiProperty({ 
    description: 'Mensaje asociado al código, útil para identificación de errores', 
    example: 'Correo enviado exitosamente' 
  })
  @IsString()
  mensaje: string;

  @ApiProperty({ 
    description: 'Resultado del consumo del método: "Procesado" ó "Error"', 
    example: 'Procesado' 
  })
  @IsString()
  resultado: string;
} 