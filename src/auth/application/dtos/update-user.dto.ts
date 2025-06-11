import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ 
    description: 'Nombre de usuario único',
    example: 'johndoe', 
    required: false 
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'john.doe@example.com', 
    required: false 
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123', 
    required: false 
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'John Doe', 
    required: false 
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Rol del usuario en el sistema',
    enum: UserRole, 
    example: UserRole.USER, 
    required: false 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Documento de empresa asignada al usuario',
    example: '123456789',
    required: false
  })
  @IsString()
  @IsOptional()
  company_document?: string;

  @ApiProperty({
    description: 'Nombre de la persona encargada de los Radianes',
    example: 'Juan',
    required: false
  })
  @IsString()
  @IsOptional()
  first_name_person_responsible?: string; 

  @ApiProperty({
    description: 'Apellido de la persona encargada de los Radianes',
    example: 'Perez',
    required: false
  })
  @IsString()
  @IsOptional()
  last_name_person_responsible?: string;

  @ApiProperty({  
    description: 'Cargo de la persona encargada de los Radianes',
    example: 'Gerente',
    required: false
  })
  @IsString()
  @IsOptional()
  job_title_person_responsible?: string;

  @ApiProperty({
    description: 'Departamento al que pertenece la persona encargada de los radianes',
    example: 'Gerente',
    required: false
  })
  @IsString()
  @IsOptional()
  organization_department_person_responsible?: string;

  @ApiProperty({
    description: 'Documento de la persona encargada de los Radianes',
    example: '123456789',
    required: false
  })
  @IsString()
  @IsOptional()
  document_person_responsible?: string;
} 