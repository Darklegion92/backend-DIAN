import { createLogger, format, transports } from 'winston';
import * as path from 'path';

const { combine, timestamp, printf } = format;

// Formato personalizado para los logs
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  const meta = { ...metadata };

  // Lógica para no registrar el body si es multipart
  if (meta.body) {
    const contentType = meta.headers && meta.headers['content-type'] ? meta.headers['content-type'] : '';
    if (contentType.includes('multipart')) {
      delete meta.body; 
    } else if (Buffer.isBuffer(meta.body)) {
      const bodyStr = meta.body.toString('utf8');
      meta.body = bodyStr.length > 2048 ? `${bodyStr.substring(0, 2048)}... (truncado)` : bodyStr;
    } else if (typeof meta.body === 'string' && meta.body.length > 2048) {
        meta.body = `${meta.body.substring(0, 2048)}... (truncado)`;
    }
  }

  if (Object.keys(meta).length > 0) {
    msg += `\nMetadata: ${JSON.stringify(meta, null, 2)}`;
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