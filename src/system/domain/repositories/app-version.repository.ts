import { AppVersion } from '../entities/app-version.entity';

export interface AppVersionRepository {
  findLatestVersion(): Promise<AppVersion | null>;
  findByVersion(version: string): Promise<AppVersion | null>;
  findAllActive(): Promise<AppVersion[]>;
  save(appVersion: AppVersion): Promise<AppVersion>;
  update(id: number, appVersion: Partial<AppVersion>): Promise<void>;
  setLatestVersion(version: string): Promise<void>;
  delete(id: number): Promise<void>;
} 