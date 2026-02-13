import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PayrollRequestDto } from '../../presentation/dtos/payroll-request.dto';
import { CreatePayrollResponseDto } from '../../presentation/dtos/payroll-response.dto';
import { PayrollDto } from '@/payroll/infrastructure/dtos/payroll.dto';
import { CatalogService } from '@/catalog/application/services/catalog.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeWorker } from '@/catalog/domain/entities/type-worker.entity';
import { Repository } from 'typeorm';
import { TypeContract } from '@/catalog/domain/entities/type-contract.entity';
import { WorkerDto } from '@/payroll/infrastructure/dtos/worker.dto';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { PeriodDto } from '@/payroll/infrastructure/dtos/period.dto';
import { PaymentDto } from '@/payroll/infrastructure/dtos/payment.dto';
import { PaymentDateDto } from '@/payroll/infrastructure/dtos/payment-date.dto';
import { AccruedDto } from '@/payroll/infrastructure/dtos/accrued.dto';
import { HDto } from '@/payroll/infrastructure/dtos/h.dto';
import { CommonVacationDto } from '@/payroll/infrastructure/dtos/common-vacation.dto';
import { PaidVacationDto } from '@/payroll/infrastructure/dtos/paid-vacation.dto';
import { ServiceBonusDto } from '@/payroll/infrastructure/dtos/service-bonus.dto';
import { SeveranceDto } from '@/payroll/infrastructure/dtos/severance.dto';
import { WorkDisabilitiesDto } from '@/payroll/infrastructure/dtos/work-disabilities.dto';
import { NonPaidLeaveDto } from '@/payroll/infrastructure/dtos/non-paid-leave.dto';
import { BonusDto } from '@/payroll/infrastructure/dtos/bonus.dto';
import { AidDto } from '@/payroll/infrastructure/dtos/aid.dto';
import { OtherConceptDto } from '@/payroll/infrastructure/dtos/other-concept.dto';
import { CompensationDto } from '@/payroll/infrastructure/dtos/compensation.dto';
import { EpctvBonusDto } from '@/payroll/infrastructure/dtos/epctv-bonus.dto';
import { CommissionDto } from '@/payroll/infrastructure/dtos/commission.dto';
import { ThirdPartyPaymentDto } from '@/payroll/infrastructure/dtos/third-party-payment.dto';
import { AdvanceDto } from '@/payroll/infrastructure/dtos/advance.dto';
import { DeductionsDto } from '@/payroll/infrastructure/dtos/deductions.dto';
import { SanctionDto } from '@/payroll/infrastructure/dtos/sanction.dto';
import { OrderDto } from '@/payroll/infrastructure/dtos/order.dto';
import { OtherDeductionDto } from '@/payroll/infrastructure/dtos/other-deduction.dto';
import { NoveltyDto } from '@/payroll/infrastructure/dtos/novelty.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from '@/company/application/services/company.service';
import { DevengadosDto, EnviarPayrollRequestDto, EnviarPayrollResponseDto } from '@/payroll/presentation/dtos/enviar-payroll.dto';
import { SubTypeWorker } from '@/catalog/domain/entities/sub-type-worker.entity';
import { PaymentMethod } from '@/catalog/domain/entities/payment-method.entity';
import { LaborUnionDto } from '@/payroll/infrastructure/dtos/labor-union.dto';


/**
 * Servicio principal para el procesamiento de nóminas electrónicas
 * Implementa la lógica de negocio para validar, generar, firmar y enviar nóminas a la DIAN
 */
@Injectable()
export class ProcessPayrollService {
  private readonly logger = new Logger(ProcessPayrollService.name);
  private readonly externalApiUrl: string;

  constructor(
    @InjectRepository(TypeWorker)
    private readonly typeWorkerRepository: Repository<TypeWorker>,
    @InjectRepository(TypeContract)
    private readonly typeContractRepository: Repository<TypeContract>,
    @InjectRepository(SubTypeWorker)
    private readonly subTypeWorkerRepository: Repository<SubTypeWorker>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly catalogService: CatalogService,
    private readonly generateDataService: GenerateDataService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly companyService: CompanyService,
  ) {
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
    if (!this.externalApiUrl) {
      throw new Error('EXTERNAL_SERVER_URL no está configurada en las variables de entorno');
    }
  }

  /**
   * Procesa una solicitud de nómina electrónica
   * @param request Datos de la nómina a procesar
   * @returns Respuesta con el resultado del procesamiento
   */
  async processPayroll(request: PayrollRequestDto): Promise<CreatePayrollResponseDto> {

    const { noelNumero, noelTipovinc, noelTipoid, noelCiu, noelTipocont,
      noelNit, noelAltor, noelApe1, noelAp2, noelNom1, noelNom2, noelDir,
      emplSalinteg, emplSalario, noelEmail, noelAno, noelMes, noelFecing, noelDiastot,
      noelTipoCta, noelCuenta, bancNombre, noelDiastr, noelSueldo, noelViaticos,
      noelViaticons, noelDotacion, noelApoyosost, noelTeletrab, noelCompensao, noelAuxtr,
      noelExdhorini, noelExdhorfin, noelExdcant, noelExtrasd, noelExnhorini, noelExnhorfin, noelExncant, noelExtrasn,
      noelRecnhorini, noelRecnhorfin, noelRecncant, noelRecnoct, noelExfhorini, noelExfhorfin, noelExfcant, noelExtrasf,
      noelRecfhorini, noelRecfhorfin, noelRecfcant, noelRecfest, noelExfnhorini, noelExfnhorfin, noelExfncant, noelExtrasfn,
      noelRecfnhorini, noelRecfnhorfin, noelRecfncant, noelRecfn, noelVacini, noelVacfin,
      noelVacacant, noelVacadisf, noelVacacomp, noelPrimadias, noelPrima, noelPrimans,
      noelCesantia, noelIntcesp, noelIntces, noelIncegini, noelIncegfin, noelIncegcant,
      noelIncapeg, noelIncepini, noelIncepfin, noelIncepcant, noelIncapep, noelLicmini,
      noelLicmfin, noelLicmcant, noelLicmat, noelLicinir, noelLicfinr, noelLicrcant,
      noelLicenciar, noelLicnrini, noelLicnrfin, noelLicnrcant, noelBonosal, noelBonons,
      noelAuxilions, noelAuxilios, noelOtros, noelOtrons, noelCompensae, noelAlimentons,
      noelAlimentos, noelBonificas, noelBonificans, noelComisiones, noelPagoterc, noelAnticipo,
      noelDedsalp, noelDedsal, noelDedpensp, noelDedpens, noelDedfsp, noelDedfspsp, noelDedpensvol,
      noelDedembargo, noelAfc, noelDedcoop, noelDedrtefte, noelDedplansal, noelDededuca, noelDedreintegro,
      noelDedpresta, noelDedsancion, noelDedlibnom, noelDedlibranza, noelDedpagot, noelDedanticipo,
      noelDedotro, noelNumant, predecessor, nitCompany
    } = request;
    try {

      const prefix = noelNumero.substring(0, 4);
      const typeWorkedId = await this.getWorkedIdByCode(noelTipovinc);

      const payrollTypeDocumentIdentificationId = await this.catalogService.getDocumentTypeIdByCode(noelTipoid);

      const municipality = await this.catalogService.getMunicipalityByCode(noelCiu);

      const worker: WorkerDto = new WorkerDto(
        typeWorkedId.toString(),
        payrollTypeDocumentIdentificationId.toString(),
        municipality.id.toString(),
        noelTipocont.toString(),
        !noelAltor,
        noelNit,
        noelApe1,
        noelAp2,
        noelNom1,
        noelNom2,
        noelDir,
        emplSalinteg == 'S',
        emplSalario,
        noelEmail,
      );

      // Obtener el primer y último día del mes
      const date = new Date(noelAno, noelMes - 1, 1); // -1 porque en JS los meses van de 0 a 11

      // Primer día del mes
      const startDate = new Date(date);

      // Último día del mes
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const settlementEndDate = this.generateDataService.formatDate(endDate);
      const settlementStartDate = this.generateDataService.formatDate(startDate);

      const period: PeriodDto = new PeriodDto(
        noelFecing,
        settlementStartDate,
        settlementEndDate,
        noelDiastot.toString(),
        settlementEndDate
      );
      const payment: PaymentDto = new PaymentDto(
        "10"
      );

      if (noelTipoCta !== null) {
        const account = noelCuenta ? noelCuenta : "00000000000000000000";
        const bankName = bancNombre ? bancNombre : "SIN BANCO";
        payment.setAccountNumber(account);
        payment.setBankName(bankName);
        payment.setPaymentMethodId("47");
        if (noelTipoCta === "A") {
          payment.setAccountType("AHORROS");
        } else {
          payment.setAccountType("CORRIENTE");
        }
      }

      const paymentDates: PaymentDateDto[] = [];

      let paymentDateFinal = settlementEndDate;

      if (period.getIssueDate() != null && period.getIssueDate().length > 0) {
        paymentDateFinal = period.getIssueDate();
      }

      const paymentDate: PaymentDateDto = new PaymentDateDto(
        paymentDateFinal,
      );

      paymentDates.push(paymentDate);

      const accrued: AccruedDto = new AccruedDto(
        noelDiastr.toString(),
        noelSueldo.toString(),
      );

      accrued.setSalaryViatics(noelViaticos);
      accrued.setNonSalaryViatics(noelViaticons);
      accrued.setEndowment(noelDotacion);
      accrued.setSustenanceSupport(noelApoyosost);
      accrued.setTelecommuting(noelTeletrab);
      accrued.setCompensation(noelCompensao);
      accrued.setTransportationAllowance(noelAuxtr);

      const hed: HDto = new HDto(noelExdhorini, noelExdhorfin,
        noelExdcant, 1, noelExtrasd);

      if (hed.getPayment() != null && hed.getPayment() !== "0.00") {
        const heds: HDto[] = [];

        heds.push(hed);
        accrued.setHEDs(heds);
      }

      const hen: HDto = new HDto(noelExnhorini, noelExnhorfin,
        noelExncant, 2, noelExtrasn);

      if (hen.getPayment() != null && hen.getPayment() !== "0.00") {
        const hens: HDto[] = [];

        hens.push(hen);
        accrued.setHENs(hens);
      }

      const hrn: HDto = new HDto(noelRecnhorini, noelRecnhorfin,
        noelRecncant, 3, noelRecnoct);

      if (hrn.getPayment() != null && hrn.getPayment() !== "0.00") {
        const hrns: HDto[] = [];

        hrns.push(hrn);
        accrued.setHRNs(hrns);
      }

      const heddf: HDto = new HDto(noelExfhorini, noelExfhorfin,
        noelExfcant, 4, noelExtrasf);

      if (heddf.getPayment() != null && heddf.getPayment() !== "0.00") {
        const heddfs: HDto[] = [];

        heddfs.push(heddf);
        accrued.setHEDDFs(heddfs);
      }

      const hrddf: HDto = new HDto(noelRecfhorini, noelRecfhorfin,
        noelRecfcant, 5, noelRecfest);

      if (hrddf.getPayment() != null && hrddf.getPayment() !== "0.00") {
        const hrddfs: HDto[] = [];

        hrddfs.push(hrddf);
        accrued.setHRDDFs(hrddfs);
      }

      const hendf: HDto = new HDto(noelExfnhorini, noelExfnhorfin,
        noelExfncant, 6, noelExtrasfn);

      if (hendf.getPayment() != null && hendf.getPayment() !== "0.00") {
        const hendfs: HDto[] = [];

        hendfs.push(hendf);
        accrued.setHENDFs(hendfs);
      }

      const hrndf: HDto = new HDto(noelRecfnhorini, noelRecfnhorfin,
        noelRecfncant, 7, noelRecfn);

      if (hrndf.getPayment() != null && hrndf.getPayment() !== "0.00") {
        const hrndfs: HDto[] = [];

        hrndfs.push(hrndf);
        accrued.setHRNDFs(hrndfs);
      }

      const commonVacation: CommonVacationDto = new CommonVacationDto(noelVacini, noelVacfin,
        noelVacacant, noelVacadisf);

      if (commonVacation.getPayment() != null && commonVacation.getPayment() !== "0.00") {
        const commonVacations: CommonVacationDto[] = [];

        commonVacations.push(commonVacation);
        accrued.setCommonVacation(commonVacations);
      }

      const paidVacation: PaidVacationDto = new PaidVacationDto(noelVacacant, noelVacacomp);

      if (paidVacation.getPayment() != null && paidVacation.getPayment() !== "0.00") {
        const paidVacations: PaidVacationDto[] = [];

        paidVacations.push(paidVacation);
        accrued.setPaidVacation(paidVacations);
      }

      const serviceBonus: ServiceBonusDto = new ServiceBonusDto(noelPrimadias, noelPrima,
        noelPrimans);

      if (serviceBonus.getPayment() != null && serviceBonus.getPayment() !== "0.00") {
        const servicesBonus: ServiceBonusDto[] = [];

        servicesBonus.push(serviceBonus);
        accrued.setServiceBonus(servicesBonus);
      }

      const severance: SeveranceDto = new SeveranceDto(noelCesantia,
        noelIntcesp, noelIntces);

      if (severance.getPayment() != null && severance.getPayment() !== "0.00") {
        const severances: SeveranceDto[] = [];

        severances.push(severance);
        accrued.setSeverance(severances);
      }

      const workDisability1: WorkDisabilitiesDto = new WorkDisabilitiesDto(
        noelIncegini, noelIncegfin,
        noelIncegcant, noelIncapeg, 3);

      const workDisability2: WorkDisabilitiesDto = new WorkDisabilitiesDto(
        noelIncepini, noelIncepfin,
        noelIncepcant, noelIncapep, 2);

      const workDisabilities: WorkDisabilitiesDto[] = [];

      if (workDisability1.getPayment() != null && workDisability1.getPayment() !== "0.00") {
        workDisabilities.push(workDisability1);
      }
      if (workDisability2.getPayment() != null && workDisability2.getPayment() !== "0.00") {
        workDisabilities.push(workDisability2);
      }
      if (workDisabilities.length > 0) {
        accrued.setWorkDisabilities(workDisabilities);
      }

      const maternityLeave: CommonVacationDto = new CommonVacationDto(noelLicmini, noelLicmfin,
        noelLicmcant, noelLicmat);

      if (maternityLeave.getPayment() != null && maternityLeave.getPayment() !== "0.00") {
        const maternityLeaves: CommonVacationDto[] = [];

        maternityLeaves.push(maternityLeave);
        accrued.setMaternityLeave(maternityLeaves);
      }

      const paidLeave: CommonVacationDto = new CommonVacationDto(noelLicinir, noelLicfinr,
        noelLicrcant, noelLicenciar);

      if (paidLeave.getPayment() != null && paidLeave.getPayment() !== "0.00") {
        const paidLeaves: CommonVacationDto[] = [];

        paidLeaves.push(paidLeave);
        accrued.setPaidLeave(paidLeaves);
      }

      const nonPaidLeave: NonPaidLeaveDto = new NonPaidLeaveDto(noelLicnrini, noelLicnrfin,
        noelLicnrcant.toString());

      if (nonPaidLeave.getQuantity() != null && nonPaidLeave.getQuantity() !== "0") {
        const nonPaidLeaves: NonPaidLeaveDto[] = [];

        nonPaidLeaves.push(nonPaidLeave);
        accrued.setNonPaidLeave(nonPaidLeaves);
      }

      const bonus: BonusDto = new BonusDto(noelBonosal, noelBonons);
      if ((bonus.getNonSalaryBonus() != null && bonus.getNonSalaryBonus() !== "0.00")
        || (bonus.getSalaryBonus() != null && bonus.getSalaryBonus() !== "0.00")) {
        const bonuses: BonusDto[] = [];
        bonuses.push(bonus);
        accrued.setBonuses(bonuses);
      }

      const aid: AidDto = new AidDto(noelAuxilios, noelAuxilions);
      if ((aid.getNonSalaryAssistance() != null && aid.getNonSalaryAssistance() !== "0.00")
        || (aid.getSalaryAssistance() != null && aid.getSalaryAssistance() !== "0.00")) {
        const aids: AidDto[] = [];
        aids.push(aid);
        accrued.setAid(aids);
      }

      const otherConcept: OtherConceptDto = new OtherConceptDto(noelOtros, noelOtrons, "Otros conceptos");
      if ((otherConcept.getNonSalaryConcept() != null && otherConcept.getNonSalaryConcept() !== "0.00")
        || (otherConcept.getSalaryConcept() != null && otherConcept.getSalaryConcept() !== "0.00")) {
        const otherConcepts: OtherConceptDto[] = [];
        otherConcepts.push(otherConcept);
        accrued.setOtherConcepts(otherConcepts);
      }

      const compensation: CompensationDto = new CompensationDto(noelCompensao, noelCompensae);
      if ((compensation.getExtraordinaryCompensation() != null && compensation.getExtraordinaryCompensation() !== "0.00")
        || (compensation.getOrdinaryCompensation() != null && compensation.getOrdinaryCompensation() !== "0.00")) {
        const compensations: CompensationDto[] = [];
        compensations.push(compensation);
        accrued.setCompensations(compensations);
      }

      const epctvBonus: EpctvBonusDto = new EpctvBonusDto(noelBonificas, noelBonificans);

      if (noelAlimentons !== "0.00") {
        epctvBonus.setSalaryFoodPayment(noelAlimentons);
      }

      if (noelAlimentos !== "0.00") {
        epctvBonus.setNonSalaryFoodPayment(noelAlimentos);
      }

      if ((epctvBonus.getNonSalaryFoodPayment() != null
        && epctvBonus.getNonSalaryFoodPayment() !== "0.00")
        || (epctvBonus.getPaymentNS() != null
          && epctvBonus.getPaymentNS() !== "0.00")
        || (epctvBonus.getPaymentS() != null
          && epctvBonus.getPaymentS() !== "0.00")
        || (epctvBonus.getSalaryFoodPayment() != null
          && epctvBonus.getSalaryFoodPayment() !== "0.00")) {
        const epctvBonuses: EpctvBonusDto[] = [];
        epctvBonuses.push(epctvBonus);
        accrued.setEpctvBonuses(epctvBonuses);
      }

      const commission: CommissionDto = new CommissionDto(noelComisiones);
      if (commission.getCommission() != null && commission.getCommission() !== "0.00") {
        const commissions: CommissionDto[] = [];
        commissions.push(commission);
        accrued.setCommissions(commissions);
      }

      const thirdPartyPayment: ThirdPartyPaymentDto = new ThirdPartyPaymentDto(
        noelPagoterc);
      if (thirdPartyPayment.getThirdPartyPayment() != null
        && thirdPartyPayment.getThirdPartyPayment() !== "0.00") {
        const thirdPartyPayments: ThirdPartyPaymentDto[] = [];
        thirdPartyPayments.push(thirdPartyPayment);
        accrued.setThirdPartyPayments(thirdPartyPayments);
      }


      const advance: AdvanceDto = new AdvanceDto(noelAnticipo);
      if (advance.getAdvance() != null && advance.getAdvance() !== "0.00") {
        const advances: AdvanceDto[] = [];
        advances.push(advance);
        accrued.setAdvances(advances);
      }


      const deductions: DeductionsDto = new DeductionsDto(
        this.obtenerIdLawDeduction(true, noelDedsalp),
        noelDedsal,
        this.obtenerIdLawDeduction(false, noelDedpensp),
        noelDedpens);

      deductions.setFondospDeductionSP(noelDedfsp);
      deductions.setFondospDeductionSub(noelDedfspsp);
      deductions.setVoluntaryPension(noelDedpensvol);
      deductions.setWithholdingAtSource(noelDedembargo);
      deductions.setAfc(noelAfc);
      deductions.setCooperative(noelDedcoop);
      deductions.setTaxLiens(noelDedrtefte);
      deductions.setSupplementaryPlan(noelDedplansal);
      deductions.setEducation(noelDededuca);
      deductions.setRefund(noelDedreintegro);
      deductions.setDebt(noelDedpresta);

      const sanction: SanctionDto = new SanctionDto(noelDedsancion);
      if (sanction.getPrivateSanction() != null && sanction.getPrivateSanction() !== "0.00") {
        const sanctions: SanctionDto[] = [];
        sanctions.push(sanction);
        deductions.setSanctions(sanctions);
      }

      const order: OrderDto = new OrderDto(noelDedlibnom, noelDedlibranza);
      if (order.getDeduction() != null && order.getDeduction() !== "0.00") {
        const orders: OrderDto[] = [];
        orders.push(order);
        deductions.setOrders(orders);
      }

      const thirdPartyPaymentDed: ThirdPartyPaymentDto = new ThirdPartyPaymentDto(
        noelDedpagot);
      if (thirdPartyPaymentDed.getThirdPartyPayment() != null
        && thirdPartyPaymentDed.getThirdPartyPayment() !== "0.00") {
        const thirdPartyPaymentDeds: ThirdPartyPaymentDto[] = [];
        thirdPartyPaymentDeds.push(thirdPartyPaymentDed);
        deductions.setThirdPartyPayments(thirdPartyPaymentDeds);
      }

      const advanceded: AdvanceDto = new AdvanceDto(noelDedanticipo);
      if (advanceded.getAdvance() != null && advanceded.getAdvance() !== "0.00") {
        const advancededs: AdvanceDto[] = [];
        advancededs.push(advanceded);
        deductions.setAdvances(advancededs);
      }

      const otherDeduction: OtherDeductionDto = new OtherDeductionDto(noelDedotro);
      if (otherDeduction.getOtherDeduction() != null
        && otherDeduction.getOtherDeduction() !== "0.00") {
        const otherDeductions: OtherDeductionDto[] = [];
        otherDeductions.push(otherDeduction);
        deductions.setOtherDeductions(otherDeductions);
      }

      const novelty: NoveltyDto = new NoveltyDto();

      const number = noelNumero.substring(4);

      const payroll = new PayrollDto(
        novelty,
        period,
        noelNit,
        prefix,
        number,
        worker,
        payment,
        paymentDates,
        accrued,
        deductions,
      );

      if (noelNumant != null) {
        payroll.setNumAnt(noelNumant);
        payroll.setTypeDocumentId("10");
        payroll.setTypeNote(1);
      }

      payroll.setPredecessor(predecessor);


      const company = await this.companyService.getCompanyByNit(nitCompany);

      const response = await this.sendPayrollToService(payroll, company.tokenDian);
      return {
        success: true,
        statusCode: 200,
        message: 'Nómina enviada correctamente',
        data: {
          cufe: response.cune,
          date: this.generateDataService.formatDate(new Date()),
        }
      }


    } catch (error) {
      this.logger.error(`❌ Error procesando nómina: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendPayrollToService(payroll: PayrollDto, token: string) {
    try {

      let url = `${this.externalApiUrl}/payroll`;

      if (payroll.getPredecessor() != null) {
        url = `${this.externalApiUrl}/payroll-adjust-note`;
      }
      this.logger.log('Enviando solicitud de nómina al servicio externo');
      this.logger.debug('URL del servicio externo:', url);
      this.logger.debug('Token:', token);
      console.log("Payroll:", JSON.stringify(payroll, null, 2));

      const response = await firstValueFrom(
        this.httpService.post<any>(
          url,
          payroll,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            timeout: 60000,
          },
        ),
      );
      console.log(response.data);

      this.logger.log('Respuesta exitosa del servicio externo');

      return response.data;
    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de facturas', { error });

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en el servicio externo';

        this.logger.error(`Error HTTP ${status}: ${message}`);

        switch (status) {
          case 400:
            throw new HttpException(
              {
                message: 'Datos de factura inválidos',
                details: error.response.data
              },
              HttpStatus.BAD_REQUEST
            );
          case 401:
            throw new HttpException(
              {
                message: 'Token de autenticación inválido',
                details: 'Verifica que el token Bearer sea válido'
              },
              HttpStatus.UNAUTHORIZED
            );
          case 408:
            throw new HttpException(
              {
                message: 'Timeout en el servicio externo',
                details: 'El servicio externo tardó demasiado en responder'
              },
              HttpStatus.REQUEST_TIMEOUT
            );
          case 500:
            throw new HttpException(
              {
                message: 'Error interno del servicio externo',
                details: error.response.data
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          case 503:
            throw new HttpException(
              {
                message: 'Servicio externo no disponible',
                details: 'El servicio externo está temporalmente fuera de servicio'
              },
              HttpStatus.SERVICE_UNAVAILABLE
            );
          default:
            throw new HttpException(
              {
                message: `Error del servicio externo: ${message}`,
                details: error.response.data
              },
              HttpStatus.BAD_GATEWAY
            );
        }
      } else if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          {
            message: 'No se puede conectar al servicio externo',
            details: `Verifica que el servicio esté ejecutándose en: ${this.externalApiUrl}`
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          {
            message: 'Timeout de conexión al servicio externo',
            details: 'El servicio externo no respondió en el tiempo esperado'
          },
          HttpStatus.REQUEST_TIMEOUT
        );
      } else {
        throw new HttpException(
          {
            message: 'Error desconocido al comunicarse con el servicio externo',
            details: error.message
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  private obtenerIdLawDeduction(isEps: boolean, percent: string) {

    if (isEps) {
      if (percent === "4.0") {
        return "3";
      } else {

        return "4";
      }
    } else {
      if (percent === "4.0") {
        return "5";
      } else {
        return "6";
      }
    }

  }


  /**
   * Envia una nómina electrónica a la DIAN
   * @param payroll - La nómina electrónica a enviar
   * @returns La respuesta de la DIAN
   */
  async enviarPayroll({ objNomina, tokenEnterprise, tokenPassword }: EnviarPayrollRequestDto): Promise<EnviarPayrollResponseDto> {

    console.log(objNomina);

    const { trabajador, periodos, pagos, novedad,fechaEmisionNom, rangoNumeracionNom,consecutivoDocumentoNom, deducciones, devengados, totalDevengados, totalDeducciones } = objNomina;

    if (tokenEnterprise == null || tokenPassword == null) {
      throw new HttpException(
        {
          message: 'Token de autenticación inválido',
          details: 'Verifica que los token no sean nulos'
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const company = await this.companyService.getCompanyByTokenEmpresa(tokenEnterprise);

    if (company == null) {
      throw new HttpException(
        {
          message: 'Token de autenticación inválido',
          details: 'Verifica que el token sea válido'
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    if (tokenPassword !== company.tokenPassword) {
      throw new HttpException(
        {
          message: 'Token de autenticación inválido',
          details: 'Verifica que el token password sea válido'
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const prefix = rangoNumeracionNom.split("-")[0];
    const number = consecutivoDocumentoNom.replaceAll(prefix, "");

    const novelty = new NoveltyDto(
      novedad.split("|")[1] === "1"
    );

    const period = new PeriodDto(
      periodos[0].fechaIngreso,
      periodos[0].fechaLiquidacionInicio,
      periodos[0].fechaLiquidacionFin,
      periodos[0].tiempoLaborado,
      fechaEmisionNom.split(" ")[0],
    );

    const typeWorkerId = await this.getWorkedIdByCode(trabajador.tipoTrabajador);

    const subTypeWorkerId = await this.getSubTypeWorkerIdByCode(trabajador.tipoTrabajador || '01');

    const payrollTypeDocumentIdentificationId = await this.catalogService.getDocumentTypeIdByCode(trabajador.tipoIdentificacion);

    const municipality = await this.catalogService.getMunicipalityByCode(trabajador.lugarTrabajoMunicipioCiudad);

    const typeContractId = await this.getTypeContractIdByCode(trabajador.tipoContrato);


    const worker = new WorkerDto(
      typeWorkerId.toString(),
      payrollTypeDocumentIdentificationId.toString(),
      municipality.id.toString(),
      typeContractId.toString(),
      trabajador.altoRiesgoPension === "1",
      trabajador.numeroDocumento,
      trabajador.primerApellido,
      trabajador.segundoApellido,
      trabajador.primerNombre,
      trabajador.otrosNombres,
      trabajador.lugarTrabajoDireccion,
      trabajador.salarioIntegral === "1",
      trabajador.sueldo,
      trabajador.email,
    );

    worker.setSubTypeWorkerId(subTypeWorkerId);

    const paymentDates: PaymentDateDto[] = [];
    let payment: PaymentDto;

    for (const pago of pagos) {

      const paymentMethodId = await this.getPaymentMethodIdByCode(pago.metodoDePago);

      payment = new PaymentDto(
        paymentMethodId
      );

      payment.setBankName(pago.nombreBanco);
      payment.setAccountType(pago.tipoCuenta);
      payment.setAccountNumber(pago.numeroCuenta);



      pago.fechasPagos.forEach(fecha => {
        const paymentDate = new PaymentDateDto(fecha.fechapagonomina);
        paymentDates.push(paymentDate);
      });
    }

    const accrued = await this.getAccrued(devengados, totalDevengados, devengados.basico[0]?.diasTrabajados || '0', trabajador.sueldo);

    const epsTypeLawDeductionsId = await this.obtenerIdLawDeduction(true, deducciones.salud[0]?.porcentaje);
    const pensionTypeLawDeductionsId = await this.obtenerIdLawDeduction(false, deducciones.fondosPensiones[0]?.porcentaje);

    const deductions = new DeductionsDto(
      epsTypeLawDeductionsId,
      deducciones.salud[0]?.deduccion,
      pensionTypeLawDeductionsId,
      deducciones.fondosPensiones[0]?.deduccion,
    );

    deductions.setDeductionsTotal(totalDeducciones);

    deductions.setFondosspTypeLawDeductionsId("9");
    deductions.setFondospDeductionSP(deducciones.fondosSP?.[0]?.deduccionSP);

    deductions.setFondosspSubTypeLawDeductionsId("9");
    deductions.setFondospDeductionSub(deducciones.fondosSP?.[0]?.deduccionSubrogada);

    const laborUnion = [];

    deducciones.sindicatos?.forEach(sindicato => {
      laborUnion.push(new LaborUnionDto(
        sindicato.porcentaje,
        sindicato.deduccion,
      ));
    });

    deductions.setLaborUnion(laborUnion);

    const sanctions = [];

    deducciones.sanciones?.forEach(sancion => {

      const sanction = new SanctionDto(
        sancion.sancionPriv,
      );

      sanction.setPublicSanction(sancion.sancionPublic);

      sanctions.push(sanction);

    });

    deductions.setSanctions(sanctions);

    const payroll = new PayrollDto(
      novelty,
      period,
      objNomina.trabajador.codigoTrabajador,
      prefix,
      number,
      worker,
      payment,
      paymentDates,
      accrued,
      deductions,

    );
    console.log(JSON.stringify(payroll, null, 2));

    const response = await this.sendPayrollToService(payroll, company.tokenDian);

    return {
      codigo: "200",
      mensaje: 'Nómina enviada correctamente',
      resultado: 'Procesado',
      consecutivoDocumento: prefix + number,
      cune: response.cune,
      trackId: "551523",
      reglasNotificacionesTFHKA: response.reglasNotificacionesTFHKA,
      reglasNotificacionesDIAN: response.reglasNotificacionesDIAN,
      reglasRechazoTFHKA: response.reglasRechazoTFHKA,
      reglasRechazoDIAN: response.reglasRechazoDIAN,
      nitEmpleador: company.identificationNumber,
      nitEmpleado: trabajador.numeroDocumento,
      idSoftware: "SOLTEC",
      qr: response.cune,
      esvalidoDIAN: true,
      xml: "ninguno"
    }
  }


  async getAccrued(devengados: DevengadosDto, totalDevengados: string, tiempoLaborado: string, sueldo: string): Promise<AccruedDto> {
    const accrued = new AccruedDto(
      tiempoLaborado,
      sueldo,
    );

    devengados?.transporte?.forEach(transporte => {
      accrued.setTransportationAllowance( (parseFloat(accrued.getTransportationAllowance() || '0') + parseFloat(transporte?.auxilioTransporte || '0')).toString());
    });

    accrued.setAccruedTotal(totalDevengados);
    //accrued.setSalaryViatics(devengados.);
    //accrued.setNonSalaryViatics(devengados.viaticos[0].viaticos);

    (devengados?.horasExtras ?? devengados?.horaExtras)?.forEach(horaExtra => {




      switch (horaExtra.tipoHorasExtra) {
        case "0":
          accrued.setHEDs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            1,
            horaExtra.pago
          )]);
          break;
        case "1":
          accrued.setHENs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            2,
            horaExtra.pago
          )]);
          break;
        case "2":
          accrued.setHRNs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            3,
            horaExtra.pago
          )]);
          break;
        case "3":
          accrued.setHEDDFs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            4,
            horaExtra.pago
          )]);
          break;
        case "4":
          accrued.setHRDDFs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            5,
            horaExtra.pago
          )]);
          break;
        case "5":
          accrued.setHENDFs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            6,
            horaExtra.pago
          )]);
          break;
        case "6":
          accrued.setHRNDFs([new HDto(
            horaExtra.horaInicio,
            horaExtra.horaFin,
            Number(horaExtra.cantidad),
            7,
            horaExtra.pago
          )]);
          break;
      }
    });

    const commonVacations = [];
    devengados?.vacaciones?.vacacionesComunes?.forEach(vacacion => {
      commonVacations.push(new CommonVacationDto(
        vacacion.fechaInicio,
        vacacion.fechaFin,
        Number(vacacion.cantidad),
        vacacion.pago
      ));

    });

    accrued.setCommonVacation(commonVacations);

    const paidVacations = [];
    devengados?.vacaciones?.vacacionesCompensadas?.forEach(vacacion => {
      paidVacations.push(new PaidVacationDto(
        Number(vacacion.cantidad),
        vacacion.pago
      ));
    });

    accrued.setPaidVacation(paidVacations);

    const serviceBonuses = [];
    devengados?.primas?.forEach(prima => {
      serviceBonuses.push(new ServiceBonusDto(
        Number(prima.cantidad),
        prima.pago,
        prima.pagoNS


      ));
    });

    accrued.setSeverance([new SeveranceDto(
      devengados.cesantias?.[0]?.pago,
      devengados.cesantias?.[0]?.porcentaje,
      devengados.cesantias?.[0]?.pagoIntereses
    )]);


    const workDisabilities = [];
    devengados?.incapacidades?.forEach(incapacidad => {
      workDisabilities.push(new WorkDisabilitiesDto(
        incapacidad.fechaInicio,
        incapacidad.fechaFin,
        Number(incapacidad.cantidad),
        incapacidad.pago,
        Number(incapacidad.tipo)
      ));
    });

    accrued.setWorkDisabilities(workDisabilities);

    const maternityLeaves = [];

    devengados?.licencias?.licenciaMP?.forEach(licencia => {
      maternityLeaves.push(new CommonVacationDto(
        licencia.fechaInicio,
        licencia.fechaFin,
        Number(licencia.cantidad),
        licencia.pago
      ));
    });

    accrued.setMaternityLeave(maternityLeaves);

    const paidLeaves = [];

    devengados?.licencias?.licenciaR?.forEach(licencia => {
      paidLeaves.push(new CommonVacationDto(
        licencia.fechaInicio,
        licencia.fechaFin,
        Number(licencia.cantidad),
        licencia.pago
      ));
    });

    accrued.setPaidLeave(paidLeaves);

    const nonPaidLeaves = [];

    devengados?.licencias?.licenciaNR?.forEach(licencia => {
      nonPaidLeaves.push(new NonPaidLeaveDto(
        licencia.fechaInicio,
        licencia.fechaFin,
        licencia.cantidad,
      ));
    });

    accrued.setNonPaidLeave(nonPaidLeaves);


    const bonuses = [];

    devengados?.bonificaciones?.forEach(bonificacion => {
      bonuses.push(new BonusDto(
        bonificacion.bonificacionS,
        bonificacion.bonificacionNS
      ));
    });

    accrued.setBonuses(bonuses);

    const aids = [];

    devengados?.auxilios?.forEach(auxilio => {
      aids.push(new AidDto(auxilio.auxilioS, auxilio.auxilioNS));
    });

    accrued.setAid(aids);

    const legalStrikes = [];

    devengados?.huelgaLegales?.forEach(huelga => {
      legalStrikes.push(new NonPaidLeaveDto(
        huelga.fechaInicio,
        huelga.fechaFin,
        huelga.cantidad
      ));
    });

    accrued.setLegalStrike(legalStrikes);

    const otherConcepts = [];

    devengados?.otrosConceptos?.forEach(concepto => {

      otherConcepts.push(new OtherConceptDto(
        concepto.conceptoS,
        concepto.conceptoNS,
        concepto.descripcionConcepto
      ));
    });

    accrued.setOtherConcepts(otherConcepts);

    const compensations = [];

    devengados?.compensaciones?.forEach(compensacion => {
      compensations.push(new CompensationDto(compensacion.compensacionO, compensacion.compensacionE));
    });

    accrued.setCompensations(compensations);

    const epctvBonuses = [];

    devengados?.bonoEPCTV?.forEach(bono => {
      epctvBonuses.push(new EpctvBonusDto(
        bono.pagoAlimentacionS,
        bono.pagoAlimentacionNS,
      ));
    });

    accrued.setEpctvBonuses(epctvBonuses);

    const commissions = [];

    devengados?.comisiones?.forEach(comision => {
      commissions.push(new CommissionDto(comision.montoComision));
    });

    accrued.setCommissions(commissions);

    const thirdPartyPayments = [];

    devengados?.pagosTerceros?.forEach(pago => {
      thirdPartyPayments.push(new ThirdPartyPaymentDto(pago.montopagotercero ?? (pago as { pagoTercero?: string }).pagoTercero ?? '0'));
    });

    accrued.setThirdPartyPayments(thirdPartyPayments);

    const advances = [];

    devengados?.anticiposNom?.forEach(anticipo => {
      advances.push(new AdvanceDto(
        anticipo.montoanticipo
      ));
    });

    accrued.setAdvances(advances);

    accrued.setEndowment(devengados.apoyoSost);

    accrued.setSustenanceSupport(devengados.dotacion);

    accrued.setTelecommuting(devengados.teletrabajo);

    accrued.setWithdrawalBonus(devengados.bonifRetiro);

    accrued.setCompensation(devengados.indemnizacion);


    return accrued;
  }



  async getTypeWorkerByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de tipo de trabajador es requerido');
    }

    const typeWorker = await this.typeWorkerRepository
      .createQueryBuilder('TypeWorker')
      .where('BINARY TypeWorker.code LIKE :code', { code: `%${code.trim()}%` })
      .select(['TypeWorker.id', 'TypeWorker.name', 'TypeWorker.code'])
      .getOne();

    if (!typeWorker) {
      throw new Error(`Tipo de trabajador con código '${code}' no encontrado`);
    }

    return typeWorker;
  }


  async getWorkedIdByCode(code: string) {
    const typeWorker = await this.getTypeWorkerByCode(code);
    return typeWorker.id;
  }

  async getTypeContractByCode(code: string) {
    const typeContract = await this.typeContractRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    return typeContract;
  }

  async getTypeContractIdByCode(code: string) {
    const typeContract = await this.getTypeContractByCode(code);
    return typeContract.id;
  }

  async getSubTypeWorkerIdByCode(code: string) {
    const subTypeWorker = await this.subTypeWorkerRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    return subTypeWorker?.id?.toString();
  }

  async getPaymentMethodIdByCode(code: string) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    return paymentMethod.id.toString();
  }
} 