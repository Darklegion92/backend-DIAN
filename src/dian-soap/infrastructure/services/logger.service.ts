import { createLogger, format, transports } from 'winston';
import * as path from 'path';

const { combine, timestamp, printf } = format;

// Formato personalizado para los logs
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += `\nMetadata: ${JSON.stringify(metadata, null, 2)}`;
  }
  
  return msg;
});

// Crear el logger
export const soapLogger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    // Log a consola
    new transports.Console(),
    // Log a archivo para peticiones
    new transports.File({ 
      filename: path.join('logs', 'soap-requests.log'),
      level: 'info'
    }),
    // Log a archivo separado para errores
    new transports.File({ 
      filename: path.join('logs', 'soap-errors.log'),
      level: 'error'
    })
  ]
}); 