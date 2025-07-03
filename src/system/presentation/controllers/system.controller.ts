import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Res,
  NotFoundException,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { VersionResponseDto } from '../dtos/version-response.dto';
import { AppVersionService } from '../../application/services/app-version.service';
import { CreateVersionDto } from '../../application/dtos/create-version.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@ApiTags('Sistema')
@ApiBearerAuth()
@Controller('system')
export class SystemController {
  constructor(private readonly appVersionService: AppVersionService) { }

  @Get('version')
  @ApiOperation({
    summary: 'Obtener versión actual de la aplicación',
    description: 'Retorna la información de la versión más reciente de la aplicación disponible para descarga'
  })
  @ApiResponse({
    status: 200,
    description: 'Información de versión obtenida exitosamente',
    type: VersionResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'No hay versiones disponibles'
  })
  async getVersion() {
    const versionData = await this.appVersionService.getCurrentVersion();
    return {
      success: true,
      statusCode: 200,
      data: versionData
    };
  }

  @Get('versions')
  @ApiOperation({
    summary: 'Obtener todas las versiones activas',
    description: 'Retorna la lista de todas las versiones activas de la aplicación'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de versiones obtenida exitosamente'
  })
  async getAllVersions() {
    const versions = await this.appVersionService.getAllVersions();
    return {
      success: true,
      statusCode: 200,
      data: versions
    };
  }

  @Post('versions')
  @ApiOperation({
    summary: 'Subir nueva versión de la aplicación',
    description: 'Sube un nuevo archivo .exe y crea una nueva versión de la aplicación'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo .exe y datos de la versión',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        version: { type: 'string' },
        changeLog: { type: 'array', items: { type: 'string' } },
        forceUpdate: { type: 'boolean' },
        releaseDate: { type: 'string', format: 'date' },
        description: { type: 'string' },
        isLatest: { type: 'boolean' }
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // Usar directorio temporal, luego moveremos el archivo en el servicio
        const tempPath = 'uploads/temp';

        // Crear directorio temporal si no existe
        if (!fs.existsSync(tempPath)) {
          fs.mkdirSync(tempPath, { recursive: true });
        }

        cb(null, tempPath);
      },
      filename: (req, file, cb) => {
        // Usar timestamp para evitar conflictos de nombres
        const timestamp = Date.now();
        const extension = extname(file.originalname);
        const name = file.originalname.replace(extension, '');
        cb(null, `${timestamp}-${name}${extension}`);
      },
    }),
          fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/x-msdownload' || file.originalname.endsWith('.exe')) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos .exe'), false);
        }
      },
  }))
  async uploadVersion(
    @Body() createVersionDto: CreateVersionDto,
    @UploadedFile() file: any
  ) {
    const newVersion = await this.appVersionService.createNewVersion(createVersionDto, file);
    return {
      success: true,
      statusCode: 201,
      message: 'Versión creada exitosamente',
      data: newVersion
    };
  }

  @Put('versions/:version/latest')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Marcar versión como la más reciente',
    description: 'Establece una versión específica como la más reciente'
  })
  async setLatestVersion(@Param('version') version: string) {
    await this.appVersionService.setLatestVersion(version);
    return {
      success: true,
      statusCode: 200,
      message: `Versión ${version} establecida como la más reciente`
    };
  }

  @Delete('versions/:id')
  @ApiOperation({
    summary: 'Eliminar versión',
    description: 'Desactiva una versión específica (eliminación lógica)'
  })
  async deleteVersion(@Param('id', ParseIntPipe) id: number) {
    await this.appVersionService.deleteVersion(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Versión eliminada exitosamente'
    };
  }

  @Get('download/:version')
  @ApiOperation({
    summary: 'Descargar archivo de versión',
    description: 'Descarga el archivo .exe de una versión específica'
  })
  async downloadVersion(
    @Param('version') version: string,
    @Res() res: Response
  ) {
    const appVersion = await this.appVersionService.getVersionByNumber(version);

    if (!appVersion.filePath || !fs.existsSync(appVersion.filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${appVersion.originalFileName || appVersion.fileName}"`);

    const fileStream = fs.createReadStream(appVersion.filePath);
    fileStream.pipe(res);
  }
} 