import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get(':invoiceNumber/status')
  @HttpCode(HttpStatus.OK)
  async getInvoiceStatus(@Param('invoiceNumber') invoiceNumber: string) {
    return await this.invoiceService.getInvoiceStatus(invoiceNumber);
  }
} 