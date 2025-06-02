import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class UserDian{
    @ApiProperty({
        description: 'ID único del usuario',
        example: 1,
      })
      @PrimaryGeneratedColumn('increment')
      id: number;

      @ApiProperty({
        description: 'Token del usuario',
        example: 'token-string-here',
      })
      @Column({ name: 'name', type: 'varchar' })
      name: string;

      @ApiProperty({
        description: 'Email del usuario',
        example: 'email@example.com',
      })
      @Column({ name: 'email', type: 'varchar' })
      email: string;
      

      @ApiProperty({
        description: 'Password del usuario',
        example: 'password-string-here',
      })
      @Column({ name: 'password', type: 'varchar' })
      password: string;
      

      @ApiProperty({
        description: 'Token API DIAN',
        example: 'token-string-here',
      })
      @Column({ name: 'api_token', type: 'varchar' })
      apiToken: string;
      
}