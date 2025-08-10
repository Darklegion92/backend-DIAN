export interface IHistorialDeEntregas {
  /** Dirección IP del computador en el cual se realizó el acuse del correo de notificación */
  LeidoEmailIPAddress?: string;
  
  /** Estatus del acuse del correo de notificación */
  LeidoEstatus?: string;
  
  /** Fecha del acuse del correo de notificación */
  LeidoFecha?: string;
  
  /** Canal de entrega del documento electrónico */
  canalDeEntrega?: string;
  
  /** Email del receptor del documento electrónico */
  email?: string[];
  
  /** Estatus de la entrega: '0': Correo no enviado, '200': Correo enviado */
  entregaEstatus?: string;
  
  /** Descripción del Estatus de la entrega */
  entregaEstatusDescripcion?: string;
  
  /** Fecha de la Entrega del documento */
  entregaFecha?: string;
  
  /** Fecha de la Entrega */
  fechaProgramada?: string;
  
  /** Mensaje personalizado para entrega por Email, Whatsapp o Telegram */
  mensajePersonalizado?: string;
  
  /** NIT del Proveedor Tecnológico receptor, en caso de entrega por Interoperabilidad */
  nitProveedorReceptor?: string;
  
  /** Comentario de Acuse de Recibo del Cliente */
  recepcionEmailComentario?: string;
  
  /** Estatus de recepción del Correo Electrónico: 1: Aceptado, 2: Rechazado, 3: En verificación */
  recepcionEmailEstatus?: string;
  
  /** Fecha de recepción del Correo Electrónico */
  recepcionEmailFecha?: string;
  
  /** Dirección IP de recepción del Correo Electrónico */
  recepcionEmailIPAddress?: string;
  
  /** Para entrega por Whatsapp/Telegram */
  telefono?: string;
} 