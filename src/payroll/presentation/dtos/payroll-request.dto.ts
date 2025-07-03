import { PredecessorDto } from '@/payroll/infrastructure/dtos/predecessor.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional, ValidateIf } from 'class-validator';

export class PayrollRequestDto {
  @ApiProperty({ description: 'Año de la nómina', example: 2024 })
  @IsOptional()
  noelAno: number;

  @ApiProperty({ description: 'Mes de la nómina', example: 1 })
  @IsOptional()
  noelMes: number;

  @ApiProperty({ description: 'NIT de la empresa', example: '900123456' })
  @IsOptional()
  noelNit: string;

  @ApiProperty({ description: 'Ítem de la nómina', example: 1 })
  @IsOptional()
  noelItem: number;

  @ApiProperty({ description: 'Nombre del empleado', example: 'Juan Pérez' })
  @IsOptional()
  noelNombre: string;

  @ApiProperty({ description: 'Prefijo de la nómina', example: 'NE' })
  @IsOptional()
  noelPrefijo: string;

  @ApiProperty({ description: 'Número de la nómina', example: '001' })
  @IsOptional()
  noelNumero: string;

  @ApiProperty({ description: 'Fecha de la nómina', example: '2024-01-31' })
  @IsOptional()
  noelFecha: string;

  @ApiProperty({ description: 'Periodo de la nómina', example: '202401' })
  @IsOptional()
  noelPeriodo: string;

  @ApiProperty({ description: 'CUNE de la nómina' })
  @IsOptional()
  noelCune: string;

  @ApiProperty({ description: 'Primer apellido del empleado' })
  @IsOptional()
  noelApe1: string;

  @ApiProperty({ description: 'Segundo apellido del empleado' })
  @IsOptional()
  noelAp2: string;

  @ApiProperty({ description: 'Primer nombre del empleado' })
  @IsOptional()
  noelNom1: string;

  @ApiProperty({ description: 'Segundo nombre del empleado' })
  @IsOptional()
  noelNom2: string;

  @ApiProperty({ description: 'Ciudad del empleado' })
  @IsOptional()
  noelCiu: string;

  @ApiProperty({ description: 'Dirección del empleado' })
  @IsOptional()
  noelDir: string;

  @ApiProperty({ description: 'Email del empleado' })
  @IsOptional()
  noelEmail: string;

  @ApiProperty({ description: 'Tipo de identificación del empleado' })
  @IsOptional()
  noelTipoid: string;

  @ApiProperty({ description: 'Fecha de ingreso del empleado' })
  @IsOptional()
  noelFecing: string;

  @ApiProperty({ description: 'Fecha de retiro del empleado' })
  @IsOptional()
  noelFecret: string;

  @ApiProperty({ description: 'Tipo de contrato' })
  @IsOptional()
  noelTipocont: number;

  @ApiProperty({ description: 'Subtipo de contrato' })
  @IsOptional()
  noelSubtipoc: number;

  @ApiProperty({ description: 'Banco del empleado' })
  @IsOptional()
  noelBanco: string;

  @ApiProperty({ description: 'Cuenta bancaria del empleado' })
  @IsOptional()
  noelCuenta: string;

  @ApiProperty({ description: 'Tipo de cuenta bancaria' })
  @IsOptional()
  noelTipoCta: string;

  @ApiProperty({ description: 'Alto riesgo' })
  @IsOptional()
  noelAltor: string;

  @ApiProperty({ description: 'Sueldo del empleado' })
  @IsOptional()
  noelSueldo: string;

  @ApiProperty({ description: 'Días trabajados' })
  @IsOptional()
  noelDiastr: number;

  @ApiProperty({ description: 'Auxilio de transporte' })
  @IsOptional()
  noelAuxtr: string;

  @ApiProperty({ description: 'Comisiones' })
  @IsOptional()
  noelComisiones?: string;

  @ApiProperty({ description: 'Incapacidad EG' })
  @IsOptional()
  noelIncapeg?: string;

  @ApiProperty({ description: 'Fecha inicio incapacidad EG' })
  @IsOptional()
  noelIncegini?: string;

  @ApiProperty({ description: 'Fecha fin incapacidad EG' })
  @IsOptional()
  noelIncegfin?: string;

  @ApiProperty({ description: 'Cantidad días incapacidad EG' })
  @IsOptional()
  noelIncegcant?: number;

  @ApiProperty({ description: 'Incapacidad EP' })
  @IsOptional()
  noelIncapep?: string;

  @ApiProperty({ description: 'Fecha inicio incapacidad EP' })
  @IsOptional()
  noelIncepini?: string;

  @ApiProperty({ description: 'Fecha fin incapacidad EP' })
  @IsOptional()
  noelIncepfin?: string;

  @ApiProperty({ description: 'Cantidad días incapacidad EP' })
  @IsOptional()
  noelIncepcant?: number;

  @ApiProperty({ description: 'Vacaciones disfrutadas' })
  @IsOptional()
  noelVacadisf?: string;

  @ApiProperty({ description: 'Fecha inicio vacaciones' })
  @IsOptional()
  noelVacini?: string;

  @ApiProperty({ description: 'Fecha fin vacaciones' })
  @IsOptional()
  noelVacfin?: string;

  @ApiProperty({ description: 'Cantidad días vacaciones' })
  @IsOptional()
  noelVacacant?: number;

  @ApiProperty({ description: 'Vacaciones compensadas' })
  @IsOptional()
  noelVacacomp?: string;

  @ApiProperty({ description: 'Cantidad días vacaciones compensadas' })
  @IsOptional()
  noelVacacompcant?: number;

  @ApiProperty({ description: 'Licencia remunerada' })
  @IsOptional()
  noelLicenciar?: string;

  @ApiProperty({ description: 'Fecha inicio licencia remunerada' })
  @IsOptional()
  noelLicinir?: string;

  @ApiProperty({ description: 'Fecha fin licencia remunerada' })
  @IsOptional()
  noelLicfinr?: string;

  @ApiProperty({ description: 'Cantidad días licencia remunerada' })
  @IsOptional()
  noelLicrcant?: number;

  @ApiProperty({ description: 'Horas extras diurnas' })
  @IsOptional()
  noelExtrasd?: string;

  @ApiProperty({ description: 'Hora inicio extras diurnas' })
  @IsOptional()
  noelExdhorini?: string;

  @ApiProperty({ description: 'Hora fin extras diurnas' })
  @IsOptional()
  noelExdhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas extras diurnas' })
  @IsOptional()
  noelExdcant?: number;

  @ApiProperty({ description: 'Horas extras nocturnas' })
  @IsOptional()
  noelExtrasn?: string;

  @ApiProperty({ description: 'Hora inicio extras nocturnas' })
  @IsOptional()
  noelExnhorini?: string;

  @ApiProperty({ description: 'Hora fin extras nocturnas' })
  @IsOptional()
  noelExnhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas extras nocturnas' })
  @IsOptional()
  noelExncant?: number;

  @ApiProperty({ description: 'Horas extras festivas' })
  @IsOptional()
  noelExtrasf?: string;

  @ApiProperty({ description: 'Hora inicio extras festivas' })
  @IsOptional()
  noelExfhorini?: string;

  @ApiProperty({ description: 'Hora fin extras festivas' })
  @IsOptional()
  noelExfhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas extras festivas' })
  @IsOptional()
  noelExfcant?: number;

  @ApiProperty({ description: 'Horas extras festivas nocturnas' })
  @IsOptional()
  noelExtrasfn?: string;

  @ApiProperty({ description: 'Hora inicio extras festivas nocturnas' })
  @IsOptional()
  noelExfnhorini?: string;

  @ApiProperty({ description: 'Hora fin extras festivas nocturnas' })
  @IsOptional()
  noelExfnhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas extras festivas nocturnas' })
  @IsOptional()
  noelExfncant?: number;

  @ApiProperty({ description: 'Fecha inicio licencia no remunerada' })
  @IsOptional()
  noelLicnrini?: string;

  @ApiProperty({ description: 'Fecha fin licencia no remunerada' })
  @IsOptional()
  noelLicnrfin?: string;

  @ApiProperty({ description: 'Cantidad días licencia no remunerada' })
  @IsOptional()
  noelLicnrcant?: number;

  @ApiProperty({ description: 'Licencia de maternidad' })
  @IsOptional()
  noelLicmat?: string;

  @ApiProperty({ description: 'Fecha inicio licencia maternidad' })
  @IsOptional()
  noelLicmini?: string;

  @ApiProperty({ description: 'Fecha fin licencia maternidad' })
  @IsOptional()
  noelLicmfin?: string;

  @ApiProperty({ description: 'Cantidad días licencia maternidad' })
  @IsOptional()
  noelLicmcant?: number;

  @ApiProperty({ description: 'Recargo nocturno' })
  @IsOptional()
  noelRecnoct?: string;

  @ApiProperty({ description: 'Hora inicio recargo nocturno' })
  @IsOptional()
  noelRecnhorini?: string;

  @ApiProperty({ description: 'Hora fin recargo nocturno' })
  @IsOptional()
  noelRecnhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas recargo nocturno' })
  @IsOptional()
  noelRecncant?: number;

  @ApiProperty({ description: 'Recargo festivo' })
  @IsOptional()
  noelRecfest?: string;

  @ApiProperty({ description: 'Hora inicio recargo festivo' })
  @IsOptional()
  noelRecfhorini?: string;

  @ApiProperty({ description: 'Hora fin recargo festivo' })
  @IsOptional()
  noelRecfhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas recargo festivo' })
  @IsOptional()
  noelRecfcant?: number;

  @ApiProperty({ description: 'Recargo festivo nocturno' })
  @IsOptional()
  noelRecfn?: string;

  @ApiProperty({ description: 'Hora inicio recargo festivo nocturno' })
  @IsOptional()
  noelRecfnhorini?: string;

  @ApiProperty({ description: 'Hora fin recargo festivo nocturno' })
  @IsOptional()
  noelRecfnhorfin?: string;

  @ApiProperty({ description: 'Cantidad horas recargo festivo nocturno' })
  @IsOptional()
  noelRecfncant?: number;

  @ApiProperty({ description: 'Auxilios' })
  @IsOptional()
  noelAuxilios?: string;

  @ApiProperty({ description: 'Auxilios no salariales' })
  @IsOptional()
  noelAuxilions?: string;

  @ApiProperty({ description: 'Bonificaciones' })
  @IsOptional()
  noelBonificas?: string;

  @ApiProperty({ description: 'Bonificaciones no salariales' })
  @IsOptional()
  noelBonificans?: string;

  @ApiProperty({ description: 'Alimentos' })
  @IsOptional()
  noelAlimentos?: string;

  @ApiProperty({ description: 'Alimentos no salariales' })
  @IsOptional()
  noelAlimentons?: string;

  @ApiProperty({ description: 'Apoyo sostenimiento' })
  @IsOptional()
  noelApoyosost?: string;

  @ApiProperty({ description: 'Dotación' })
  @IsOptional()
  noelDotacion?: string;

  @ApiProperty({ description: 'Indemnización' })
  @IsOptional()
  noelIndemniza?: string;

  @ApiProperty({ description: 'Reintegro' })
  @IsOptional()
  noelReintegro?: string;

  @ApiProperty({ description: 'Teletrabajo' })
  @IsOptional()
  noelTeletrab?: string;

  @ApiProperty({ description: 'Anticipo' })
  @IsOptional()
  noelAnticipo?: string;

  @ApiProperty({ description: 'Compensación extraordinaria' })
  @IsOptional()
  noelCompensae?: string;

  @ApiProperty({ description: 'Compensación ordinaria' })
  @IsOptional()
  noelCompensao?: string;

  @ApiProperty({ description: 'Cesantía' })
  @IsOptional()
  noelCesantia?: string;

  @ApiProperty({ description: 'Intereses de cesantía' })
  @IsOptional()
  noelIntces?: string;

  @ApiProperty({ description: 'Intereses de cesantía parciales' })
  @IsOptional()
  noelIntcesp?: string;

  @ApiProperty({ description: 'Prima de servicios' })
  @IsOptional()
  noelPrima?: string;

  @ApiProperty({ description: 'Prima no salarial' })
  @IsOptional()
  noelPrimans?: string;

  @ApiProperty({ description: 'Días de prima' })
  @IsOptional()
  noelPrimadias?: number;

  @ApiProperty({ description: 'Otros conceptos' })
  @IsOptional()
  noelOtros?: string;

  @ApiProperty({ description: 'Otros conceptos no salariales' })
  @IsOptional()
  noelOtrons?: string;

  @ApiProperty({ description: 'Pago a terceros' })
  @IsOptional()
  noelPagoterc?: string;

  @ApiProperty({ description: 'Deducción salud' })
  @IsOptional()
  noelDedsal?: string;

  @ApiProperty({ description: 'Deducción salud porcentaje' })
  @IsOptional()
  noelDedsalp?: string;

  @ApiProperty({ description: 'Deducción pensión' })
  @IsOptional()
  noelDedpens?: string;

  @ApiProperty({ description: 'Deducción pensión porcentaje' })
  @IsOptional()
  noelDedpensp?: string;

  @ApiProperty({ description: 'AFC' })
  @IsOptional()
  noelAfc?: string;

  @ApiProperty({ description: 'Deducción FSP' })
  @IsOptional()
  noelDedfsp?: string;

  @ApiProperty({ description: 'Deducción FSP porcentaje' })
  @IsOptional()
  noelDedfspp?: string;

  @ApiProperty({ description: 'Deducción FSP sub porcentaje' })
  @IsOptional()
  noelDedfspsp?: string;

  @ApiProperty({ description: 'Deducción libranza' })
  @IsOptional()
  noelDedlibranza?: string;

  @ApiProperty({ description: 'Nombre libranza' })
  @IsOptional()
  noelDedlibnom?: string;

  @ApiProperty({ description: 'Deducción préstamos' })
  @IsOptional()
  noelDedpresta?: string;

  @ApiProperty({ description: 'Deducción cooperativa' })
  @IsOptional()
  noelDedcoop?: string;

  @ApiProperty({ description: 'Deducción embargo' })
  @IsOptional()
  noelDedembargo?: string;

  @ApiProperty({ description: 'Deducción retención en la fuente' })
  @IsOptional()
  noelDedrtefte?: string;

  @ApiProperty({ description: 'Deducción pensión voluntaria' })
  @IsOptional()
  noelDedpensvol?: string;

  @ApiProperty({ description: 'Deducción plan salud' })
  @IsOptional()
  noelDedplansal?: string;

  @ApiProperty({ description: 'Deducción reintegro' })
  @IsOptional()
  noelDedreintegro?: string;

  @ApiProperty({ description: 'Deducción anticipo' })
  @IsOptional()
  noelDedanticipo?: string;

  @ApiProperty({ description: 'Otras deducciones' })
  @IsOptional()
  noelDedotro?: string;

  @ApiProperty({ description: 'Deducción pago a terceros' })
  @IsOptional()
  noelDedpagot?: string;

  @ApiProperty({ description: 'Deducción sanción' })
  @IsOptional()
  noelDedsancion?: string;

  @ApiProperty({ description: 'Deducción sindicato' })
  @IsOptional()
  noelDedsindi?: string;

  @ApiProperty({ description: 'Total días' })
  @IsOptional()
  noelDiastot?: number;

  @ApiProperty({ description: 'Viáticos' })
  @IsOptional()
  noelViaticos?: string;

  @ApiProperty({ description: 'Viáticos no salariales' })
  @IsOptional()
  noelViaticons?: string;

  @ApiProperty({ description: 'Bono salarial' })
  @IsOptional()
  noelBonosal?: string;

  @ApiProperty({ description: 'Bono no salarial' })
  @IsOptional()
  noelBonons?: string;

  @ApiProperty({ description: 'Deducción educación' })
  @IsOptional()
  noelDededuca?: string;

  @ApiProperty({ description: 'Salario integral' })
  @IsOptional()
  noelSalinte?: number;

  @ApiProperty({ description: 'Fecha DIAN' })
  @IsOptional()
  noelFechadian?: string;

  @ApiProperty({ description: 'Número anterior' })
  @IsOptional()
  noelNumant?: string;

  @ApiProperty({ description: 'Tipo de vinculación' })
  @IsOptional()
  noelTipovinc?: string;

  @ApiProperty({ description: 'Tipo NE' })
  @IsOptional()
  noelTipone?: number;

  @ApiProperty({ description: 'Total devengado', example: '2059569.00' })
  @IsOptional()
  @IsString()
  noelDevengado: string;

  @ApiProperty({ description: 'Total deducido', example: '668290.00' })
  @IsOptional()
  @IsString()
  noelDeducido: string;

  @ApiProperty({ description: 'Total neto', example: '1391279.00' })
  @IsOptional()
  @IsString()
  noelNeto: string;

  @ApiProperty({ description: 'Estado del documento' })
  @IsOptional()
  noelEstado: string;

  @ApiProperty({ description: 'Nombre del banco' })
  @IsOptional()
  bancNombre: string;

  @ApiProperty({ description: 'Salario del empleado' })
  @IsOptional()
  emplSalario: string;

  @ApiProperty({ description: 'Salario integral del empleado' })
  @IsOptional()
  emplSalinteg: string;

  @ApiProperty({ description: 'NIT de la empresa' })
  @IsOptional()
  nitCompany: string;

  @ApiProperty({ description: 'Predecesor', nullable: true })
  @IsOptional()
  predecessor?: PredecessorDto;

} 