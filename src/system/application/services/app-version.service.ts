import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { AppVersionRepository } from '../../domain/repositories/app-version.repository';
import { AppVersion } from '../../domain/entities/app-version.entity';
import { VersionResponseDto } from '../../presentation/dtos/version-response.dto';
import { CreateVersionDto } from '../dtos/create-version.dto';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const APP_VERSION_REPOSITORY = 'APP_VERSION_REPOSITORY';

@Injectable()
export class AppVersionService {
  constructor(
    @Inject(APP_VERSION_REPOSITORY)
    private readonly appVersionRepository: AppVersionRepository,
  ) {}

  async getCurrentVersion(): Promise<VersionResponseDto> {
    const latestVersion = await this.appVersionRepository.findLatestVersion();
    
    if (!latestVersion) {
      throw new NotFoundException('No hay versiones disponibles');
    }

    return new VersionResponseDto(
      latestVersion.version,
      latestVersion.downloadUrl,
      latestVersion.changeLog,
      latestVersion.forceUpdate,
      latestVersion.releaseDate,
      latestVersion.fileSize,
      latestVersion.checksum,
      latestVersion.isLatest,
      latestVersion.fileName,
      latestVersion.originalFileName
    );
  }

  async createNewVersion(createVersionDto: CreateVersionDto, file: any): Promise<AppVersion> {
    // Verificar si ya existe una versión con el mismo número
    const existingVersion = await this.appVersionRepository.findByVersion(createVersionDto.version);
    if (existingVersion) {
      // Limpiar archivo temporal
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new BadRequestException(`La versión ${createVersionDto.version} ya existe`);
    }

    // La ruta temporal del archivo donde multer lo guardó
    const tempFilePath = file.path;
    let finalFilePath: string;

    try {
      // Calcular checksum del archivo desde el disco
      const checksum = await this.calculateChecksumFromFile(tempFilePath);

      // Crear directorio de destino para esta versión
      const finalDirectory = `uploads/versions/${createVersionDto.version}`;
      if (!fs.existsSync(finalDirectory)) {
        fs.mkdirSync(finalDirectory, { recursive: true });
      }

      // Generar nombre único para el archivo
      const uniqueFileName = this.generateUniqueFileName(file.originalname);
      
      // Crear ruta final del archivo
      finalFilePath = path.join(finalDirectory, uniqueFileName);

      // Mover archivo del directorio temporal al directorio final
      try {
        fs.renameSync(tempFilePath, finalFilePath);
      } catch (error) {
        // Si rename falla (puede ser por diferentes particiones), usar copy + delete
        fs.copyFileSync(tempFilePath, finalFilePath);
        fs.unlinkSync(tempFilePath);
      }

      // Crear nueva versión
      const newVersion = new AppVersion();
      newVersion.version = createVersionDto.version;
      newVersion.downloadUrl = createVersionDto.downloadUrl || `/system/download/${createVersionDto.version}`;
      newVersion.changeLog = createVersionDto.changeLog;
      newVersion.forceUpdate = createVersionDto.forceUpdate || false;
      newVersion.releaseDate = createVersionDto.releaseDate;
      newVersion.fileSize = file.size;
      newVersion.checksum = checksum;
      newVersion.fileName = uniqueFileName;
      newVersion.originalFileName = file.originalname;
      newVersion.filePath = finalFilePath;
      newVersion.description = createVersionDto.description;
      newVersion.isActive = true;

      // Guardar la nueva versión
      const savedVersion = await this.appVersionRepository.save(newVersion);

      // Si se marca como latest, actualizar las demás versiones
      if (createVersionDto.isLatest) {
        await this.appVersionRepository.setLatestVersion(createVersionDto.version);
      }

      return savedVersion;
    } catch (error) {
      // Limpiar archivos en caso de error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      if (finalFilePath && fs.existsSync(finalFilePath)) {
        fs.unlinkSync(finalFilePath);
      }
      throw error;
    }
  }

  async getAllVersions(): Promise<AppVersion[]> {
    return await this.appVersionRepository.findAllActive();
  }

  async getVersionByNumber(version: string): Promise<AppVersion> {
    const appVersion = await this.appVersionRepository.findByVersion(version);
    
    if (!appVersion) {
      throw new NotFoundException(`Versión ${version} no encontrada`);
    }

    return appVersion;
  }

  async setLatestVersion(version: string): Promise<void> {
    const appVersion = await this.appVersionRepository.findByVersion(version);
    
    if (!appVersion) {
      throw new NotFoundException(`Versión ${version} no encontrada`);
    }

    await this.appVersionRepository.setLatestVersion(version);
  }

  async deleteVersion(id: number): Promise<void> {
    await this.appVersionRepository.delete(id);
  }

  private calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private async calculateChecksumFromFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', (data) => {
        hash.update(data);
      });
      
      stream.on('end', () => {
        resolve(hash.digest('hex'));
      });
      
      stream.on('error', (error) => {
        reject(error);
      });
    });
  }

  private generateUniqueFileName(originalName: string): string {
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const uuid = randomUUID();
    const timestamp = Date.now();
    
    // Formato: baseName_timestamp_uuid.extension
    return `${baseName}_${timestamp}_${uuid}${extension}`;
  }
} 