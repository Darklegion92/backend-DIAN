import { InvoiceRequestDto } from '@/invoice/domain/interfaces/invoice-request.interface';
import { CreditNoteRequestDto } from '@/credit-note/domain/interfaces/credit-note.interface';


const date = new Date().toISOString().split('T')[0];
const time = new Date().toISOString().split('T')[1];

/**
 * Datos quemados de factura electrónica (invoice) para pruebas o uso en el módulo company.
 */
export const TEST_INVOICE_DATA: InvoiceRequestDto = {
  "number": 990100001,
  "type_document_id": 1,
  date: date,//el formato es YYYY-MM-DD
  time: time,//el formato es HH:MM:SS
  "resolution_number": "18760000001",
  "prefix": "SETP",
  "notes": "ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA, ESTA ES UNA NOTA DE PRUEBA",
  "disable_confirmation_text": true,
  "establishment_name": "TORRE SOFTWARE",
  "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
  "establishment_phone": 3226563672,
  "establishment_municipality": 600,
  "establishment_email": "alternate_email@alternate.com",
  "sendmail": true,
  "sendmailtome": true,
  "send_customer_credentials": false,
  "seze": "2021-2017",
  "email_cc_list": [
    {
      "email": "alexanderobandolondono@gmail.com"
    },
    {
      "email": "alexander_obando@hotmail.com"
    }
  ],
  "html_header": "<h1 style=\"color: #5e9ca0;\">Se&ntilde;or(es), XXXXXXXXXXXXXXXXXXX identificado con NIT 99999999-9</h1><h2 style=\"color: #2e6c80;\">Le informamos que ha recibido un documento electronico de: YYYYYYYYYYYYYYYYYYYYYYYYY</h2>",
  "html_buttons": "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\"><tbody><tr><td style=\"width: 100%;\"><h2><strong><span style=\"color: #008080;\">Puede descargar su factura mediante el siguiente enlace:</span></strong></h2></td></tr><tr><td style=\"width: 100%;\"><h4><a href=\"https://www.facilwebnube.com/apidian2021/public/index.php/api/download/88261176/FES-FE369.pdf\" target=\"_blank\">Haga click aqui para descargar su factura.</a></h4></td></tr></tbody></table>",
  "html_footer": "<table style=\"border-collapse: collapse; width: 100%;\" border=\"1\"><tbody><tr><td style=\"width: 100%;\"><h2><strong><span style=\"color: #008080;\">Previamente recibio un correo con las credenciales de ingreso a la plataforma.</span></strong></h2></td></tr><tr><td style=\"width: 100%;\"><div><h4><strong>Este es un sistema autom&aacute;tico de aviso, por favor no responda este mensaje de correo.</strong></h4></div></td></tr></tbody></table>",
  "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
  "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL PIE DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
  "customer": {
    "identification_number": "89008003",
    "dv": "2",
    "name": "INVERSIONES DAVAL SAS",
    "phone": "3103891693",
    "address": "CLL 4 NRO 33-90",
    "email": "alexanderobandolondono@gmail.com",
    "merchant_registration": "0000000-00",
    "type_document_identification_id": 6,
    "type_organization_id": 1,
    "type_liability_id": 7,
    "municipality_id": 822,
    "type_regime_id": 1
  },
  "payment_form":[ {
    "payment_form_id": 2,
    "payment_method_id": 30,
    "payment_due_date": new Date().toISOString(),//el formato es YYYY-MM-DD
    "duration_measure": 0
  }],
  "legal_monetary_totals": {
    "line_extension_amount": 840336.134,
    "tax_exclusive_amount": 840336.134,
    "tax_inclusive_amount": 1000000.00,
    "payable_amount": 1000000.00,
  },
  "tax_totals":
    [
      {
        "tax_id": 1,
        "tax_amount": 159663.865,
        "percent": 19.00,
        "taxable_amount": 840336.134,
      }
    ],
  "invoice_lines":
    [
      {
        "unit_measure_id": 70,
        "invoiced_quantity": 1,
        "line_extension_amount": 840336.134,
        "free_of_charge_indicator": false,
        "tax_totals": [
          {
            "tax_id": 1,
            "tax_amount": 159663.865,
            "taxable_amount": 840336.134,
            "percent": 19.00,
          }
        ],
        "description": "COMISION POR SERVICIOS",
        "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
        "code": "COMISION",
        "type_item_identification_id": 4,
        "price_amount": 1000000.00,
        "base_quantity": 1,
      }
    ]
};

/**
 * Datos quemados de nota crédito (credit-note) para pruebas o uso en el módulo company.
 */
export const TEST_CREDIT_NOTE_DATA: CreditNoteRequestDto = {
  "billing_reference": {
    "number": "SETP990000937",
    "uuid": "cf2f3415b1a3d90501df87a899640eeb86d02bbc40cdc56115e2fa885ccc81a2f318bcb7010dff4db4747719e2c95dd6",
    "issue_date": "2024-01-17"
  },
  "discrepancyresponsecode": 2,
  "discrepancyresponsedescription": "PRUEBA DE MOTIVO NOTA CREDITO",
  "notes": "PRUEBA DE NOTA CREDITO",
  "prefix": "NC",
  "number": 10001,
  "type_document_id": 4,
  "date": date,//el formato es YYYY-MM-DD
  "time": time,//el formato es HH:MM:SS
  "establishment_name": "TORRE SOFTWARE",
  "establishment_address": "BRR LIMONAR MZ 6 CS 3 ET 1 PISO 2",
  "establishment_phone": "3226563672",
  "establishment_municipality": "600",
  "sendmail": false,
  "sendmailtome": false,
  "seze": "2021-2017",
  "head_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
  "foot_note": "PRUEBA DE TEXTO LIBRE QUE DEBE POSICIONARSE EN EL ENCABEZADO DE PAGINA DE LA REPRESENTACION GRAFICA DE LA FACTURA ELECTRONICA VALIDACION PREVIA DIAN",
  "customer": {
    "identification_number": "900166483",
    "dv": "1",
    "name": "INVERSIONES DAVAL SAS",
    "phone": "3103891693",
    "address": "CLL 4 NRO 33-90",
    "email": "alexanderobandolondono@gmail.com",
    "merchant_registration": "0000000-00",
    "type_document_identification_id": 6,
    "type_organization_id": 1,
    "municipality_id": 822,
    "type_regime_id": 1
  },
  "tax_totals": [
    {
      "tax_id": 1,
      "tax_amount": 159663.865,
      "percent": 19,
      "taxable_amount": 840336.134,
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": 840336.134,
    "tax_exclusive_amount": 840336.134,
    "tax_inclusive_amount": 1000000.00,
    "payable_amount": 1000000.00,
  },
  "credit_note_lines":
    [
      {
        "unit_measure_id": 70,
        "invoiced_quantity": 1,
        "line_extension_amount": 840336.134,
        "free_of_charge_indicator": false,
        "tax_totals": [
          {
            "tax_id": 1,
            "tax_amount": 159663.865,
            "taxable_amount": 840336.134,
            "percent": 19.00,
          }
        ],
        "description": "COMISION POR SERVICIOS",
        "notes": "ESTA ES UNA PRUEBA DE NOTA DE DETALLE DE LINEA.",
        "code": "COMISION",
        "type_item_identification_id": 4,
        "price_amount": 840336.134,
        "base_quantity": 1,
      }
    ]
}


