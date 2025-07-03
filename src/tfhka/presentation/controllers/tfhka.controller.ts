import { Body, Controller, Post } from '@nestjs/common';
import { EnviarRequestDto } from '../dtos/request/enviar-request.dto';
import { EnviarResponseDto } from '../dtos/response/enviar-response.dto';

@Controller('tfhka')
export class TfhkaController {
    constructor() {}

    @Post('enviar')
    enviar(@Body() enviarRequest: EnviarRequestDto): EnviarResponseDto {
        // TODO: Implementar
        console.log(enviarRequest);
        return new EnviarResponseDto();
    }

    @Post('estado-documento')
    estadoDocumento(@Body() estadoDocumentoRequest: any) {
        // TODO: Implementar
        return 'estado-documento';
    }

    @Post('estado-legal-documentos')
    estadoLegalDocumentos(@Body() estadoLegalDocumentosRequest: any) {
        // TODO: Implementar
        return 'estado-legal-documentos';
    }

    @Post('envio-correo')
    envioCorreo(@Body() envioCorreoRequest: any) {
        // TODO: Implementar
        return 'envio-correo';
    }

    @Post('descarga-pdf')
    descargaPdf(@Body() descargaPdfRequest: any) {
        // TODO: Implementar
        return 'descarga-pdf';
    }

    @Post('descarga-xml')
    descargaXml(@Body() descargaXmlRequest: any) {
        // TODO: Implementar
        return 'descarga-xml';
    }

    @Post('folios-restantes')
    foliosRestantes(@Body() foliosRestantesRequest: any) {
        // TODO: Implementar
        return 'folios-restantes';
    }

    @Post('cargar-certificado')
    cargarCertificado(@Body() cargarCertificadoRequest: any) {
        // TODO: Implementar
        return 'cargar-certificado';
    }

    @Post('descargar-evento-xml')
    descargarEventoXml(@Body() descargarEventoXmlRequest: any) {
        // TODO: Implementar
        return 'descargar-evento-xml';
    }

    @Post('generar-contenedor')
    generarContenedor(@Body() generarContenedorRequest: any) {
        // TODO: Implementar
        return 'generar-contenedor';
    }

    @Post('generar-evento')
    generarEvento(@Body() generarEventoRequest: any) {
        // TODO: Implementar
        return 'generar-evento';
    }

    @Post('estado-certificado')
    estadoCertificado(@Body() estadoCertificadoRequest: any) {
        // TODO: Implementar
        return 'estado-certificado';
    }
} 