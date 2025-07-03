import { NoveltyDto } from './novelty.dto';
import { PeriodDto } from './period.dto';
import { WorkerDto } from './worker.dto';
import { PaymentDto } from './payment.dto';
import { PaymentDateDto } from './payment-date.dto';
import { AccruedDto } from './accrued.dto';
import { DeductionsDto } from './deductions.dto';
import { PredecessorDto } from './predecessor.dto';

/**
 * DTO principal para la nómina electrónica
 * Contiene toda la información necesaria para generar un documento de nómina
 */
export class PayrollDto {
  private type_document_id: string;
  private sendmail: boolean;
  private sendmailtome: boolean;
  private readonly worker_code: string;
  private readonly prefix: string;
  private readonly consecutive: string;
  private readonly payroll_period_id: string;
  private notes?: string;
  private readonly period: PeriodDto;
  private readonly novelty: NoveltyDto;
  private readonly worker: WorkerDto;
  private readonly payment: PaymentDto;
  private readonly payment_dates: PaymentDateDto[];
  private readonly accrued: AccruedDto;
  private readonly deductions: DeductionsDto;
  private numAnt?: string;
  private predecessor?: PredecessorDto;
  private type_note?: number;

  constructor(
    novelty: NoveltyDto,
    period: PeriodDto,
    workerCode: string,
    prefix: string,
    consecutive: string,
    worker: WorkerDto,
    payment: PaymentDto,
    paymentDates: PaymentDateDto[],
    accrued: AccruedDto,
    deductions: DeductionsDto
  ) {
    this.type_document_id = '9';
    this.novelty = novelty;
    this.period = period;
    this.worker_code = workerCode;
    this.prefix = prefix;
    this.consecutive = consecutive;
    this.payroll_period_id = '5';
    this.worker = worker;
    this.payment = payment;
    this.payment_dates = paymentDates;
    this.accrued = accrued;
    this.deductions = deductions;
    this.sendmail = true;
    this.sendmailtome = true;
  }

  // Getters
  getTypeNote(): number | undefined {
    return this.type_note;
  }

  getTypeDocumentId(): string {
    return this.type_document_id;
  }

  getNovelty(): NoveltyDto {
    return this.novelty;
  }

  getPeriod(): PeriodDto {
    return this.period;
  }

  isSendmail(): boolean {
    return this.sendmail;
  }

  isSendmailtome(): boolean {
    return this.sendmailtome;
  }

  getWorkerCode(): string {
    return this.worker_code;
  }

  getPrefix(): string {
    return this.prefix;
  }

  getConsecutive(): string {
    return this.consecutive;
  }

  getPayrollPeriodId(): string {
    return this.payroll_period_id;
  }

  getNotes(): string | undefined {
    return this.notes;
  }

  getWorker(): WorkerDto {
    return this.worker;
  }

  getPayment(): PaymentDto {
    return this.payment;
  }

  getPaymentDates(): PaymentDateDto[] {
    return this.payment_dates;
  }

  getAccrued(): AccruedDto {
    return this.accrued;
  }

  getDeduction(): DeductionsDto {
    return this.deductions;
  }

  getNumAnt(): string | undefined {
    return this.numAnt;
  }

  getPredecessor(): PredecessorDto | undefined {
    return this.predecessor;
  }

  // Setters
  setTypeNote(value: number): void {
    this.type_note = value;
  }

  setTypeDocumentId(value: string): void {
    this.type_document_id = value;
  }

  setSendmail(value: boolean): void {
    this.sendmail = value;
  }

  setSendmailtome(value: boolean): void {
    this.sendmailtome = value;
  }

  setNotes(value: string): void {
    this.notes = value;
  }

  setNumAnt(value: string): void {
    this.numAnt = value;
  }

  setPredecessor(value: PredecessorDto): void {
    this.predecessor = value;
  }
} 