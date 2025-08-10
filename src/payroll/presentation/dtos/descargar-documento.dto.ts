import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

/**
 * DTOs para los métodos DescargarXML y DescargarPDF de Nómina Electrónica DIAN
 * Basado en la documentación oficial de The Factory HKA Colombia
 */

export class DescargarDocumentoRequestDto {
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
    description: 'Prefijo y Consecutivo del Documento electrónico concatenado sin separadores', 
    example: 'PRUE980338212' 
  })
  @IsString()
  @IsNotEmpty()
  consecutivoDocumentoNom: string;
}

export class DescargarXMLResponseDto {
  @ApiProperty({ 
    description: 'Código de respuesta que indica el estado de la operación', 
    example: 200 
  })
  @IsNumber()
  codigo: number;

  @ApiProperty({ 
    description: 'Código Único de Nómina Electrónica correspondiente al documento consultado', 
    example: 'CUNE123456789012345678901234567890123456789012345678901234567890' 
  })
  @IsString()
  cune: string;

  @ApiProperty({ 
    description: 'Documento XML codificado en Base64', 
    example: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4K...' 
  })
  @IsString()
  documento: string;

  @ApiProperty({ 
    description: 'Código de detección de errores', 
    example: 'a1b2c3d4e5f6' 
  })
  @IsString()
  hash: string;

  @ApiProperty({ 
    description: 'Mensaje asociado al código, útil para identificación de errores', 
    example: 'Documento descargado exitosamente' 
  })
  @IsString()
  mensaje: string;

  @ApiProperty({ 
    description: 'Prefijo y consecutivo del Documento Electrónico concatenado sin separadores', 
    example: 'PRUE980338212' 
  })
  @IsString()
  nombre: string;

  @ApiProperty({ 
    description: 'Resultado del consumo del método: "Procesado" ó "Error"', 
    example: 'Procesado' 
  })
  @IsString()
  resultado: string;
}

export class DescargarPDFResponseDto {
  @ApiProperty({ 
    description: 'Código de respuesta que indica el estado de la operación', 
    example: 200 
  })
  @IsNumber()
  codigo: number;

  @ApiProperty({ 
    description: 'Código Único de Nómina Electrónica correspondiente al documento consultado', 
    example: 'CUNE123456789012345678901234567890123456789012345678901234567890' 
  })
  @IsString()
  cune: string;

  @ApiProperty({ 
    description: 'Documento PDF codificado en Base64', 
    example: 'JVBERi0xLjQKJcOkw7zDtsO...' 
  })
  @IsString()
  documento: string;

  @ApiProperty({ 
    description: 'Código de detección de errores', 
    example: 'a1b2c3d4e5f6' 
  })
  @IsString()
  hash: string;

  @ApiProperty({ 
    description: 'Mensaje asociado al código, útil para identificación de errores', 
    example: 'Documento descargado exitosamente' 
  })
  @IsString()
  mensaje: string;

  @ApiProperty({ 
    description: 'Prefijo y consecutivo del Documento Electrónico concatenado sin separadores', 
    example: 'PRUE980338212' 
  })
  @IsString()
  nombre: string;

  @ApiProperty({ 
    description: 'Resultado del consumo del método: "Procesado" ó "Error"', 
    example: 'Procesado' 
  })
  @IsString()
  resultado: string;
} 