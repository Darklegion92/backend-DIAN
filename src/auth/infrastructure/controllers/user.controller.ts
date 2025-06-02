import { Controller, Post, Put, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetUsersPaginatedUseCase } from '../../application/use-cases/get-users-paginated.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@ApiTags('users')
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
  ) {}

  @Get('currentUser')
  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del usuario actual obtenida exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<UserResponseDto> {
    return this.getCurrentUserUseCase.execute(currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista paginada de usuarios' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo para ordenar', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del ordenamiento', example: 'DESC' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' }
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
  })
  async findAllPaginated(@Query() paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.getUsersPaginatedUseCase.execute(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.getUserByIdUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: User })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.updateUserUseCase.execute(id, updateUserDto);
  }
} 