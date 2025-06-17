import { Controller, Post, Put, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetUsersPaginatedUseCase } from '../../application/use-cases/get-users-paginated.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { ChangePasswordDto } from '../../application/dtos/change-password.dto';
import { UserResponseDto, InternalUserResponseDto } from '../../application/dtos/user-response.dto';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@ApiTags('👥 Gestión de Usuarios')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUsersPaginatedUseCase: GetUsersPaginatedUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Get('currentUser')
  @ApiOperation({ 
    summary: 'Obtener información del usuario actual',
    description: 'Obtiene la información completa del usuario autenticado actual.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del usuario actual obtenida exitosamente',
    type: UserResponseDto,
    examples: {
      success: {
        summary: 'Usuario obtenido exitosamente',
        value: {
          success: true,
          statusCode: 200,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/currentUser',
          method: 'GET',
          data: {
            id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
            username: 'johndoe',
            email: 'john.doe@example.com',
            name: 'John Doe',
            role: 'USER',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 404 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/currentUser' },
        method: { type: 'string', example: 'GET' },
        message: { type: 'string', example: 'Usuario no encontrado' }
      }
    }
  })
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<InternalUserResponseDto> {
    return this.getCurrentUserUseCase.execute(currentUser);
  }

  @Put('change-password')
  @ApiOperation({ 
    summary: 'Cambiar contraseña del usuario actual',
    description: 'Permite al usuario autenticado cambiar su contraseña proporcionando la contraseña actual y la nueva.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contraseña cambiada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/change-password' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'Contraseña cambiada exitosamente' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Contraseña actual incorrecta',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 401 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/change-password' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'La contraseña actual es incorrecta' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/change-password' },
        method: { type: 'string', example: 'PUT' },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['La nueva contraseña debe tener al menos 8 caracteres']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.changePasswordUseCase.execute(currentUser, changePasswordDto);
    return {
      success: true,
      message: 'Contraseña cambiada exitosamente'
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener lista paginada de usuarios',
    description: 'Obtiene una lista paginada de todos los usuarios del sistema con opciones de filtrado y ordenamiento. Solo accesible para ADMIN.',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página (empezando desde 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de elementos por página', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo por el cual ordenar', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del ordenamiento (ASC o DESC)', example: 'DESC' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users' },
        method: { type: 'string', example: 'GET' },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890' },
                  username: { type: 'string', example: 'johndoe' },
                  email: { type: 'string', example: 'john.doe@example.com' },
                  name: { type: 'string', example: 'John Doe' },
                  role: { type: 'string', example: 'USER' },
                  createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
                  updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
                }
              }
            },
            meta: {
              type: 'object',
              properties: {
                currentPage: { type: 'number', example: 1 },
                itemsPerPage: { type: 'number', example: 10 },
                totalItems: { type: 'number', example: 25 },
                totalPages: { type: 'number', example: 3 },
                hasPreviousPage: { type: 'boolean', example: false },
                hasNextPage: { type: 'boolean', example: true },
              }
            }
          }
        }
      }
    }
  })
  async findAllPaginated(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<InternalUserResponseDto>> {
    return this.getUsersPaginatedUseCase.execute(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un usuario por ID',
    description: 'Obtiene la información completa de un usuario específico usando su ID único. Solo accesible para ADMIN.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado exitosamente',
    type: UserResponseDto,
    examples: {
      success: {
        summary: 'Usuario encontrado',
        value: {
          success: true,
          statusCode: 200,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
          method: 'GET',
          data: {
            id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
            username: 'johndoe',
            email: 'john.doe@example.com',
            name: 'John Doe',
            role: 'USER',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 404 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/invalid-id' },
        method: { type: 'string', example: 'GET' },
        message: { type: 'string', example: 'Usuario no encontrado' }
      }
    }
  })
  async findOne(@Param('id') id: string): Promise<InternalUserResponseDto> {
    return this.getUserByIdUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con los datos proporcionados. Solo accesible para ADMIN.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente', 
    type: UserResponseDto,
    examples: {
      success: {
        summary: 'Usuario creado',
        value: {
          success: true,
          statusCode: 201,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users',
          method: 'POST',
          data: {
            id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
            username: 'newuser',
            email: 'newuser@example.com',
            name: 'New User',
            role: 'USER',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email o username ya está registrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 409 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users' },
        method: { type: 'string', example: 'POST' },
        message: { type: 'string', example: 'El email ya está registrado' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users' },
        method: { type: 'string', example: 'POST' },
        message: { type: 'string', example: 'Error de validación' },
        error: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['email must be an email', 'password is too weak']
        }
      }
    }
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Actualizar un usuario existente',
    description: 'Actualiza los datos de un usuario existente usando su ID único. Solo accesible para ADMIN.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado exitosamente', 
    type: UserResponseDto,
    examples: {
      success: {
        summary: 'Usuario actualizado',
        value: {
          success: true,
          statusCode: 200,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/users/a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
          method: 'PUT',
          data: {
            id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
            username: 'updateduser',
            email: 'updated@example.com',
            name: 'Updated User',
            role: 'USER',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T12:45:00Z'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 404 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/invalid-id' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'Usuario no encontrado' }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'El email o username ya está registrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 409 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/users/a1b2c3d4-e5f6-7890-ab12-cd34ef567890' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'El email ya está registrado' }
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }
} 