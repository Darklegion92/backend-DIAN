import { Injectable } from '@nestjs/common';
import { DocumentTransformer } from './document-transformer.interface';
import { InvoiceTransformerService } from './invoice-transformer.service';
import { CreditNoteTransformerService } from './credit-note-transformer.service';
import { FacturaGeneralDto } from '../../../presentation/dtos/request/factura-general.dto';
import { SupportDocumentTransformerService } from './support-document-transformer.service';

@Injectable()
export class DocumentTransformerFactory {
  constructor(
    private readonly invoiceTransformer: InvoiceTransformerService,
    private readonly creditNoteTransformer: CreditNoteTransformerService,
    private readonly supportDocumentTransformer: SupportDocumentTransformerService,
  ) {}

  getTransformer(tipoDocumento: string): DocumentTransformer<any> {

    switch (tipoDocumento) {
      case '01':
        return this.invoiceTransformer;
      case '91':
        return this.creditNoteTransformer;
      case '05':
        return this.supportDocumentTransformer;
      case 'debitnote':
        throw new Error('Transformador para nota débito pendiente por implementar');
      default:
        throw new Error(`Tipo de documento no soportado: ${tipoDocumento}`);
    }
  }

  transform(factura: FacturaGeneralDto, companyId: number, adjuntos?: string): any {
    const transformer = this.getTransformer(factura.tipoDocumento);
    
    return transformer.transform(factura, companyId, adjuntos);
  }
} 