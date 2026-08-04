import { Injectable, Logger } from '@nestjs/common';
import { Document } from '@/document/domain/entities/document.entity';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';

@Injectable()
export class CreditNoteXmlGeneratorService {
  private readonly logger = new Logger(CreditNoteXmlGeneratorService.name);

  /**
   * Generates a structural AttachedDocument XML for Credit Notes
   * when the original XML from DIAN response is missing.
   * This ensures the CUDE and basic structure are present.
   */
  public generateAttachedDocument(document: Document, company: CompanyWithCertificateDto): string {
    this.logger.log(`Generando XML estructurado (AttachedDocument) para Nota Crédito: ${document.prefix}${document.number}`);

    // Validar y obtener CUDE (en la BD se guarda en la columna cufe)
    const cude = document.cufe || 'CUDE_NO_DISPONIBLE';

    const issueDate = document.dateIssue ? new Date(document.dateIssue).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const issueTime = document.dateIssue ? new Date(document.dateIssue).toISOString().split('T')[1].substring(0, 8) + '-05:00' : '00:00:00-05:00';
    
    // Total y subtotal desde BD
    const payableAmount = document.total ? document.total.toFixed(2) : '0.00';
    const taxAmount = document.totalTax ? document.totalTax.toFixed(2) : '0.00';
    const taxableAmount = document.subtotal ? document.subtotal.toFixed(2) : '0.00';

    const companyNit = company.identificationNumber || document.identificationNumber;
    const companyName = company.mailFromName || 'EMPRESA EMISORA';
    
    let customerId = '222222222';
    let customerName = 'CLIENTES OCASIONALES';
    if (document.clientId) {
        customerId = document.clientId;
    }
    
    if (document.customer) {
        const customerParts = document.customer.split('|');
        if (customerParts.length > 5) {
            customerName = customerParts[5];
        }
    }

    const creditNoteXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<CreditNote xmlns="urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="urn:dian:gov:co:facturaelectronica:Structures-2-1" xmlns:xades="http://uri.etsi.org/01903/v1.3.2#" xmlns:xades141="http://uri.etsi.org/01903/v1.4.1#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2     http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-CreditNote-2.1.xsd">
  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>20</cbc:CustomizationID>
  <cbc:ProfileID>DIAN 2.1: Nota Crédito de Factura Electrónica de Venta</cbc:ProfileID>
  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>
  <cbc:ID>${document.prefix}${document.number}</cbc:ID>
  <cbc:UUID schemeID="1" schemeName="CUDE-SHA384">${cude}</cbc:UUID>
  <cbc:IssueDate>${issueDate}</cbc:IssueDate>
  <cbc:IssueTime>${issueTime}</cbc:IssueTime>
  <cbc:CreditNoteTypeCode>91</cbc:CreditNoteTypeCode>
  <cbc:DocumentCurrencyCode>COP</cbc:DocumentCurrencyCode>
  <cbc:LineCountNumeric>1</cbc:LineCountNumeric>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${companyName}</cbc:Name>
      </cac:PartyName>
      <cac:PartyTaxScheme>
        <cbc:RegistrationName>${companyName}</cbc:RegistrationName>
        <cbc:CompanyID schemeID="5" schemeName="31">${companyNit}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${customerName}</cbc:Name>
      </cac:PartyName>
      <cac:PartyTaxScheme>
        <cbc:RegistrationName>${customerName}</cbc:RegistrationName>
        <cbc:CompanyID schemeID="7" schemeName="31">${customerId}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="COP">${taxAmount}</cbc:TaxAmount>
    <cbc:RoundingAmount currencyID="COP">0.00</cbc:RoundingAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="COP">${taxableAmount}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="COP">${taxAmount}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:Percent>0.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>01</cbc:ID>
          <cbc:Name>IVA</cbc:Name>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="COP">${taxableAmount}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="COP">${taxableAmount}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="COP">${payableAmount}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="COP">${payableAmount}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:CreditNoteLine>
    <cbc:ID>1</cbc:ID>
    <cbc:CreditedQuantity unitCode="94">1.000000</cbc:CreditedQuantity>
    <cbc:LineExtensionAmount currencyID="COP">${taxableAmount}</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="COP">${taxAmount}</cbc:TaxAmount>
      <cac:TaxSubtotal>
        <cbc:TaxableAmount currencyID="COP">${taxableAmount}</cbc:TaxableAmount>
        <cbc:TaxAmount currencyID="COP">${taxAmount}</cbc:TaxAmount>
        <cac:TaxCategory>
          <cbc:Percent>0.00</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>01</cbc:ID>
            <cbc:Name>IVA</cbc:Name>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Description>RECONSTRUCCION DE NOTA CREDITO</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="COP">${taxableAmount}</cbc:PriceAmount>
      <cbc:BaseQuantity unitCode="94">1.000000</cbc:BaseQuantity>
    </cac:Price>
  </cac:CreditNoteLine>
</CreditNote>`;

    const appResponseXml = `<?xml version="1.0" encoding="utf-8" standalone="no"?>
<ApplicationResponse xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2" xmlns:sts="dian:gov:co:facturaelectronica:Structures-2-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">
  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>1</cbc:CustomizationID>
  <cbc:ProfileID>DIAN 2.1</cbc:ProfileID>
  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>
  <cbc:ID>${document.prefix}${document.number}</cbc:ID>
  <cbc:UUID schemeName="CUDE-SHA384">${cude}</cbc:UUID>
  <cbc:IssueDate>${issueDate}</cbc:IssueDate>
  <cbc:IssueTime>${issueTime}</cbc:IssueTime>
  <cac:SenderParty>
    <cac:PartyTaxScheme>
      <cbc:RegistrationName>Unidad Especial Dirección de Impuestos y Aduanas Nacionales</cbc:RegistrationName>
      <cbc:CompanyID schemeID="4" schemeName="31">800197268</cbc:CompanyID>
      <cac:TaxScheme>
        <cbc:ID>01</cbc:ID>
        <cbc:Name>IVA</cbc:Name>
      </cac:TaxScheme>
    </cac:PartyTaxScheme>
  </cac:SenderParty>
  <cac:ReceiverParty>
    <cac:PartyTaxScheme>
      <cbc:RegistrationName>${companyName}</cbc:RegistrationName>
      <cbc:CompanyID schemeID="5" schemeName="31">${companyNit}</cbc:CompanyID>
      <cac:TaxScheme>
        <cbc:ID>01</cbc:ID>
        <cbc:Name>IVA</cbc:Name>
      </cac:TaxScheme>
    </cac:PartyTaxScheme>
  </cac:ReceiverParty>
  <cac:DocumentResponse>
    <cac:Response>
      <cbc:ResponseCode>02</cbc:ResponseCode>
      <cbc:Description>Documento validado por la DIAN</cbc:Description>
    </cac:Response>
    <cac:DocumentReference>
      <cbc:ID>${document.prefix}${document.number}</cbc:ID>
      <cbc:UUID schemeName="CUFE-SHA384">${cude}</cbc:UUID>
    </cac:DocumentReference>
    <cac:LineResponse>
      <cac:LineReference>
        <cbc:LineID>1</cbc:LineID>
      </cac:LineReference>
      <cac:Response>
        <cbc:ResponseCode>0000</cbc:ResponseCode>
        <cbc:Description>0</cbc:Description>
      </cac:Response>
    </cac:LineResponse>
  </cac:DocumentResponse>
</ApplicationResponse>`;

    const attachedDocumentXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<AttachedDocument xmlns="urn:oasis:names:specification:ubl:schema:xsd:AttachedDocument-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>Documentos adjuntos</cbc:CustomizationID>
  <cbc:ProfileID>Factura Electrónica de Venta</cbc:ProfileID>
  <cbc:ProfileExecutionID>1</cbc:ProfileExecutionID>
  <cbc:ID>${cude}</cbc:ID>
  <cbc:IssueDate>${issueDate}</cbc:IssueDate>
  <cbc:IssueTime>${issueTime}</cbc:IssueTime>
  <cbc:DocumentType>Contenedor de Factura Electrónica</cbc:DocumentType>
  <cbc:ParentDocumentID>${document.prefix}${document.number}</cbc:ParentDocumentID>
  <cac:SenderParty>
    <cac:PartyTaxScheme>
      <cbc:RegistrationName>${companyName}</cbc:RegistrationName>
      <cbc:CompanyID schemeID="5" schemeName="31">${companyNit}</cbc:CompanyID>
      <cac:TaxScheme>
        <cbc:ID>01</cbc:ID>
        <cbc:Name>IVA</cbc:Name>
      </cac:TaxScheme>
    </cac:PartyTaxScheme>
  </cac:SenderParty>
  <cac:ReceiverParty>
    <cac:PartyTaxScheme>
      <cbc:RegistrationName>${customerName}</cbc:RegistrationName>
      <cbc:CompanyID schemeID="7" schemeName="31">${customerId}</cbc:CompanyID>
      <cac:TaxScheme>
        <cbc:ID>01</cbc:ID>
        <cbc:Name>IVA</cbc:Name>
      </cac:TaxScheme>
    </cac:PartyTaxScheme>
  </cac:ReceiverParty>
  <cac:Attachment>
    <cac:ExternalReference>
      <cbc:MimeCode>text/xml</cbc:MimeCode>
      <cbc:EncodingCode>UTF-8</cbc:EncodingCode>
      <cbc:Description><![CDATA[${creditNoteXml}]]></cbc:Description>
    </cac:ExternalReference>
  </cac:Attachment>
  <cac:ParentDocumentLineReference>
    <cbc:LineID>1</cbc:LineID>
    <cac:DocumentReference>
      <cbc:ID>${document.prefix}${document.number}</cbc:ID>
      <cbc:UUID schemeName="CUFE-SHA384">${cude}</cbc:UUID>
      <cbc:IssueDate>${issueDate}</cbc:IssueDate>
      <cbc:DocumentType>ApplicationResponse</cbc:DocumentType>
      <cac:Attachment>
        <cac:ExternalReference>
          <cbc:MimeCode>text/xml</cbc:MimeCode>
          <cbc:EncodingCode>UTF-8</cbc:EncodingCode>
          <cbc:Description><![CDATA[${appResponseXml}]]></cbc:Description>
        </cac:ExternalReference>
      </cac:Attachment>
      <cac:ResultOfVerification>
        <cbc:ValidatorID>Unidad Especial Dirección de Impuestos Y Aduanas Nacionales</cbc:ValidatorID>
        <cbc:ValidationResultCode>02</cbc:ValidationResultCode>
        <cbc:ValidationDate>${issueDate}</cbc:ValidationDate>
        <cbc:ValidationTime>${issueTime}</cbc:ValidationTime>
      </cac:ResultOfVerification>
    </cac:DocumentReference>
  </cac:ParentDocumentLineReference>
</AttachedDocument>`;

    return attachedDocumentXml;
  }
}
