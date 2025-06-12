import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';
import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nombre de usuario único',
    example: 'johndoe' 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'john.doe@example.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'John Doe' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Rol del usuario en el sistema',
    enum: UserRole, 
    example: UserRole.USER 
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;


  @ApiProperty({
    description: 'Documento de empresa asignada al usuario',
    example: '123456789'
  })
  @Optional()
  company_document: string;

  @ApiProperty({
    description: 'Nombre de la persona encargada de los Radianes',
    example: 'Juan'
  })
  @Optional()
  first_name_person_responsible?: string;

  @ApiProperty({
    description: 'Apellido de la persona encargada de los Radianes',
    example: 'Perez'
  })
  @Optional()
  last_name_person_responsible?: string;

  @ApiProperty({
    description: 'Cargo de la persona encargada de los Radianes',
    example: 'Gerente'
  })
  @Optional()
  job_title_person_responsible?: string;
  
  @ApiProperty({
    description: 'Departamento al que pertenece la persona encargada de los radianes',
    example: 'Gerente'
  })
  @Optional()
  organization_department_person_responsible?: string;

  @ApiProperty({
    description: 'Documento de la persona encargada de los Radianes',
    example: 'Gerente'
  })
  @Optional()
  document_person_responsible?: string;


} 
