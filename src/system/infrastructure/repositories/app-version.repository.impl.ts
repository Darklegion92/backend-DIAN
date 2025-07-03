import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppVersion } from '../../domain/entities/app-version.entity';
import { AppVersionRepository } from '../../domain/repositories/app-version.repository';

@Injectable()
export class AppVersionRepositoryImpl implements AppVersionRepository {
  constructor(
    @InjectRepository(AppVersion)
    private readonly appVersionRepository: Repository<AppVersion>,
  ) {}

  async findLatestVersion(): Promise<AppVersion | null> {
    return await this.appVersionRepository.findOne({
      where: { isLatest: true, isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findByVersion(version: string): Promise<AppVersion | null> {
    return await this.appVersionRepository.findOne({
      where: { version, isActive: true }
    });
  }

  async findAllActive(): Promise<AppVersion[]> {
    return await this.appVersionRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async save(appVersion: AppVersion): Promise<AppVersion> {
    return await this.appVersionRepository.save(appVersion);
  }

  async update(id: number, appVersion: Partial<AppVersion>): Promise<void> {
    await this.appVersionRepository.update(id, appVersion);
  }

  async setLatestVersion(version: string): Promise<void> {
    // Primero, desmarcar todas las versiones como latest
    await this.appVersionRepository.update(
      { isActive: true },
      { isLatest: false }
    );

    // Luego, marcar la nueva versión como latest
    await this.appVersionRepository.update(
      { version, isActive: true },
      { isLatest: true }
    );
  }

  async delete(id: number): Promise<void> {
    await this.appVersionRepository.update(id, { isActive: false });
  }
} 