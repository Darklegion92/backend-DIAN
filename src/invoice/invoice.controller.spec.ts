import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoiceService = {
    createInvoice: jest.fn(),
    getInvoiceStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        number: 'FACT001',
        type_document_id: '01',
        date: '2025-01-21',
        time: '10:30:00',
        resolution_number: '18764007051231',
        prefix: 'PREF',
        customer: {
          identification_number: '12345678',
          name: 'Cliente Test',
        },
        payment_form: {
          payment_form_id: '1',
        },
        legal_monetary_totals: {
          line_extension_amount: '100000',
          tax_exclusive_amount: '100000',
          tax_inclusive_amount: '119000',
          payable_amount: '119000',
        },
        tax_totals: [
          {
            tax_id: '01',
            tax_amount: '19000',
          },
        ],
        invoice_lines: [
          {
            unit_measure_id: '94',
            invoiced_quantity: '1',
            line_extension_amount: '100000',
            free_of_charge_indicator: 'false',
            description: 'Producto de prueba',
            code: 'PROD001',
            price_amount: '100000',
            base_quantity: '1',
          },
        ],
      };

      const expectedResult = {
        success: true,
        message: 'Factura creada exitosamente',
        data: { id: '123' },
        statusCode: 200,
      };

      mockInvoiceService.createInvoice.mockResolvedValue(expectedResult);

      const result = await controller.createInvoice(createInvoiceDto);

      expect(service.createInvoice).toHaveBeenCalledWith(createInvoiceDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getInvoiceStatus', () => {
    it('should get invoice status successfully', async () => {
      const invoiceNumber = 'FACT001';
      const expectedResult = {
        success: true,
        data: { status: 'ACCEPTED' },
        statusCode: 200,
      };

      mockInvoiceService.getInvoiceStatus.mockResolvedValue(expectedResult);

      const result = await controller.getInvoiceStatus(invoiceNumber);

      expect(service.getInvoiceStatus).toHaveBeenCalledWith(invoiceNumber);
      expect(result).toEqual(expectedResult);
    });
  });
}); 