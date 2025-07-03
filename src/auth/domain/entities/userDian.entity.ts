import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserDian {
    @ApiProperty({
        description: 'ID único del usuario',
        example: 1,
    })
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'John Doe',
    })
    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({
        description: 'Email del usuario',
        example: 'email@example.com',
    })
    @Column({ name: 'email', type: 'varchar', length: 191, unique: true })
    email: string;

    @ApiProperty({
        description: 'Fecha de verificación del email',
        example: '2024-01-15T10:30:00Z',
    })
    @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
    emailVerifiedAt: Date;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'hashed-password',
    })
    @Column({ name: 'password', type: 'varchar', length: 191 })
    password: string;

    @ApiProperty({
        description: 'Token API DIAN',
        example: 'token-string-here',
    })
    @Column({ name: 'api_token', type: 'varchar', length: 80, nullable: true, unique: true })
    apiToken: string;

    @ApiProperty({
        description: 'Token de recordar sesión',
        example: 'remember-token',
    })
    @Column({ name: 'remember_token', type: 'varchar', length: 100, nullable: true })
    rememberToken: string;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        example: '2024-01-15T10:30:00Z',
    })
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt: Date;

    @ApiProperty({
        description: 'Fecha de última actualización',
        example: '2024-01-15T10:30:00Z',
    })
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @ApiProperty({
        description: 'Host del servidor de correo',
        example: 'smtp.example.com',
    })
    @Column({ name: 'mail_host', type: 'varchar', length: 191, default: '' })
    mailHost: string;

    @ApiProperty({
        description: 'Puerto del servidor de correo',
        example: '587',
    })
    @Column({ name: 'mail_port', type: 'varchar', length: 191, default: '' })
    mailPort: string;

    @ApiProperty({
        description: 'Usuario del servidor de correo',
        example: 'user@example.com',
    })
    @Column({ name: 'mail_username', type: 'varchar', length: 191, default: '' })
    mailUsername: string;

    @ApiProperty({
        description: 'Contraseña del servidor de correo',
        example: 'mail-password',
    })
    @Column({ name: 'mail_password', type: 'varchar', length: 191, default: '' })
    mailPassword: string;

    @ApiProperty({
        description: 'Encriptación del servidor de correo',
        example: 'tls',
    })
    @Column({ name: 'mail_encryption', type: 'varchar', length: 191, default: '' })
    mailEncryption: string;

    @ApiProperty({
        description: 'Dirección de correo remitente',
        example: 'noreply@example.com',
    })
    @Column({ name: 'mail_from_address', type: 'varchar', length: 191, nullable: true })
    mailFromAddress: string;

    @ApiProperty({
        description: 'Nombre del remitente',
        example: 'System Notifications',
    })
    @Column({ name: 'mail_from_name', type: 'varchar', length: 191, nullable: true })
    mailFromName: string;
}