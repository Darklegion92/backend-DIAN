import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
const Piscina = require('piscina');
import { join } from 'path';

@Injectable()
export class WorkerPoolService implements OnModuleDestroy {
  private readonly logger = new Logger(WorkerPoolService.name);
  private pool: any;

  constructor() {
    this.logger.log('Inicializando Thread Pool (Piscina) acotado a 4 hilos máximos.');
    
    this.pool = new Piscina({
      // Se puede configurar un archivo worker por defecto si se desea
      // filename: join(__dirname, 'worker-tasks.js'),
      minThreads: 2,
      maxThreads: 4,
      idleTimeout: 30000,
    });
  }

  /**
   * Ejecuta una tarea intensiva de CPU en un Worker Thread (subproceso).
   * @param filename Ruta absoluta al archivo que contiene la función del worker
   * @param data Datos serializables a pasar al worker
   */
  async runTask<T, R>(filename: string, data: T): Promise<R> {
    this.logger.debug(`Enviando tarea al Thread Pool. Hilos activos: ${this.pool.threads.length}`);
    try {
      const result = await this.pool.run(data, { filename });
      return result;
    } catch (error) {
      this.logger.error(`Error en el Worker Thread: ${error.message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Cerrando todos los Worker Threads...');
    await this.pool.destroy();
  }
}
