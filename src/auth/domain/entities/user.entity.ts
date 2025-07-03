import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

@Entity('users_soltec')
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
  })
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario (hash)',
    example: '$2b$10$example...',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'john.doe@example.com',
  })
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: Role,
    example: Role.USER,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
    nullable: false,
  })
  role: Role;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Documento de empresa asignada al usuario',
    example: 1,

  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  company_document: string;

  @ApiProperty({
    description: 'Documento persona encargada de los Radianes',
    example: 1,

  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  document_person_responsible: string;

  @ApiProperty({
    description: 'Nombre persona encargada de los Radianes',
    example: 'John Doe',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  first_name_person_responsible: string;

  @ApiProperty({
    description: 'Apellido persona encargada de los Radianes',
    example: 'Doe',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  last_name_person_responsible: string;


  @ApiProperty({
    description: 'Cargo persona encargada de los Radianes',
    example: 'CEO',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  job_title_person_responsible: string;

  @ApiProperty({
    description: 'Organización persona encargada de los Radianes',
    example: 'Soltec',
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  organization_department_person_responsible: string;
}
