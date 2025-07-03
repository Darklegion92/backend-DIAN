import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@/auth/domain/enums/role.enum';


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
    enum: Role, 
    example: Role.USER 
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;


  @ApiProperty({
    description: 'Documento de empresa asignada al usuario',
    example: '123456789'
  })
  @IsOptional()
  company_document: string;

  @ApiProperty({
    description: 'Nombre de la persona encargada de los Radianes',
    example: 'Juan'
  })
  @IsOptional()
  first_name_person_responsible?: string;

  @ApiProperty({
    description: 'Apellido de la persona encargada de los Radianes',
    example: 'Perez'
  })
  @IsOptional()
  last_name_person_responsible?: string;

  @ApiProperty({
    description: 'Cargo de la persona encargada de los Radianes',
    example: 'Gerente'
  })
  @IsOptional()
  job_title_person_responsible?: string;
  
  @ApiProperty({
    description: 'Departamento al que pertenece la persona encargada de los radianes',
    example: 'Gerente'
  })
  @IsOptional()
  organization_department_person_responsible?: string;

  @ApiProperty({
    description: 'Documento de la persona encargada de los Radianes',
    example: 'Gerente'
  })
  @IsOptional()
  document_person_responsible?: string;


} 
