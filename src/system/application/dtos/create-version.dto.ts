import { IsString, IsBoolean, IsArray, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVersionDto {
  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  downloadUrl?: string;

  @Transform(({ value }) => {
    // Si es string (viene de FormData), parsearlo como JSON
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // Si no se puede parsear, devolver como está
      }
    }
    // Si ya es array, devolverlo tal como está
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  changeLog: string[];

  @Transform(({ value }) => {
    // Convertir string a boolean para FormData
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  forceUpdate?: boolean;

  @IsDateString()
  releaseDate: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => {
    // Convertir string a boolean para FormData
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  isLatest?: boolean;
} 