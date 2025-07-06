import { Injectable } from '@nestjs/common';
import { DocumentTransformer } from './document-transformer.interface';
import { FacturaGeneralDto } from '../../../presentation/dtos/request/factura-general.dto';
import { CreditNoteRequestDto } from '@/credit-note/domain/interfaces/credit-note.interface';

@Injectable()
export class CreditNoteTransformerService implements DocumentTransformer<CreditNoteRequestDto> {
  async transform(factura: FacturaGeneralDto): Promise<CreditNoteRequestDto> {
    return null;
  }
} 