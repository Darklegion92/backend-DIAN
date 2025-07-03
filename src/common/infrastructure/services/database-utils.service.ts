import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Servicio utilitario para consultas genéricas de base de datos MySQL
 * Utiliza la conexión TypeORM existente configurada en el proyecto
 */
@Injectable()
export class DatabaseUtilsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource
  ) { }

  /**
   * Busca un ID por código en cualquier tabla
   * Equivalente al método buscarIdTipoNumber de Java
   * 
   * @param code - Código a buscar (se convierte a number)
   * @param tableName - Nombre de la tabla donde buscar
   * @returns ID encontrado como string, o string vacío si no existe
   */
  async findIdByCode(code: string, tableName: string): Promise<number> {
    try {
      // Validar parámetros de entrada
      if (!code || !tableName) {
        return null;
      }

      // Convertir code a number (como en el método Java original)
      const numericCode = parseInt(code, 10);
      if (isNaN(numericCode)) {
        return null;
      }

      // Ejecutar consulta SQL usando la conexión MySQL existente
      const query = `SELECT id FROM ?? WHERE code = ?`;
      const result = await this.dataSource.query(query, [tableName, numericCode]);

      // Retornar resultado (igual que el método Java)
      if (result && result.length > 0) {
        return parseInt(result[0].id.toString());
      }

      return null;
    } catch (error) {
      console.error(`Error en findIdByCode para tabla ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Método más genérico para buscar cualquier campo por cualquier valor
   * Útil para casos más complejos
   * 
   * @param searchValue - Valor a buscar
   * @param tableName - Nombre de la tabla
   * @param searchField - Campo donde buscar (default: 'code')
   * @param returnField - Campo a retornar (default: 'id')
   * @returns Valor encontrado como string, o string vacío si no existe
   */
  async findFieldByValue(
    searchValue: string | number,
    tableName: string,
    searchField: string = 'code',
    returnField: string = 'id'
  ): Promise<string> {
    try {
      if (!searchValue || !tableName) {
        return '';
      }

      const query = `SELECT ?? FROM ?? WHERE ?? = ?`;
      const result = await this.dataSource.query(query, [
        returnField,
        tableName,
        searchField,
        searchValue
      ]);

      if (result && result.length > 0) {
        return result[0][returnField]?.toString() || '';
      }

      return '';
    } catch (error) {
      console.error(`Error en findFieldByValue para tabla ${tableName}:`, error);
      return '';
    }
  }

  /**
   * Verifica si existe un registro en la tabla
   * 
   * @param searchValue - Valor a buscar
   * @param tableName - Nombre de la tabla
   * @param searchField - Campo donde buscar (default: 'code')
   * @returns true si existe, false si no existe
   */
  async existsByField(
    searchValue: string | number,
    tableName: string,
    searchField: string = 'code'
  ): Promise<boolean> {
    try {
      if (!searchValue || !tableName) {
        return false;
      }

      const query = `SELECT 1 FROM ?? WHERE ?? = ? LIMIT 1`;
      const result = await this.dataSource.query(query, [
        tableName,
        searchField,
        searchValue
      ]);

      return result && result.length > 0;
    } catch (error) {
      console.error(`Error en existsByField para tabla ${tableName}:`, error);
      return false;
    }
  }

 
} 