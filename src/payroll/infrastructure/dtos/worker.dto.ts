/**
 * DTO para la respuesta de trabajadores del servicio externo
 */
export class WorkerDto {
  // NOEL_TIPOVINC
  private readonly type_worker_id: string;
  private sub_type_worker_id: string;
  // NOEL_TIPOID
  private readonly payroll_type_document_identification_id: string;
  // NOEL_CIU
  private readonly municipality_id: string;
  // NOEL_TIPOCONT
  private readonly type_contract_id: string;
  // NOEL_ALTOR
  private readonly high_risk_pension: boolean;
  // NOEL_NIT
  private readonly identification_number: string;
  // NOEL_APE1
  private readonly surname: string;
  // NOEL_AP2
  private readonly second_surname: string;
  // NOEL_NOM1
  private readonly first_name: string;
  // NOEL_NOM2
  private readonly middle_name: string;
  // NOEL_DIR
  private readonly address: string;
  // EMPL_SALINTEG
  private readonly integral_salarary: boolean;
  // EMPL_SALARIO
  private readonly salary: string;
  // NOEL_EMAIL
  private readonly email: string;

  constructor(
    typeWorkerId: string,
    payrollTypeDocumentIdentificationId: string,
    municipalityId: string,
    typeContractId: string,
    highRiskPension: boolean,
    identificationNumber: string,
    surname: string,
    secondSurname: string,
    firstName: string,
    middleName: string,
    address: string,
    integralSalary: boolean,
    salary: string,
    email: string
  ) {
    this.type_worker_id = typeWorkerId;
    this.sub_type_worker_id = "1";
    this.payroll_type_document_identification_id = payrollTypeDocumentIdentificationId;
    this.municipality_id = municipalityId;
    this.type_contract_id = typeContractId;
    this.high_risk_pension = highRiskPension;
    this.identification_number = identificationNumber;
    this.surname = surname;
    this.second_surname = secondSurname;
    this.first_name = firstName;
    this.middle_name = middleName;
    this.address = address;
    this.integral_salarary = integralSalary;
    this.salary = salary;
    this.email = email;
  }

  getTypeWorkerId(): string {
    return this.type_worker_id;
  }

  getSubTypeWorkerId(): string {
    return this.sub_type_worker_id;
  }

  getPayrollTypeDocumentIdentificationId(): string {
    return this.payroll_type_document_identification_id;
  }

  getMunicipalityId(): string {
    return this.municipality_id;
  }

  getTypeContractId(): string {
    return this.type_contract_id;
  }

  getHighRiskPension(): boolean {
    return this.high_risk_pension;
  }

  getIdentificationNumber(): string {
    return this.identification_number;
  }

  getSurname(): string {
    return this.surname;
  }

  getSecondSurname(): string {
    return this.second_surname;
  }

  getFirstName(): string {
    return this.first_name;
  }

  getMiddleName(): string {
    return this.middle_name;
  }

  getAddress(): string {
    return this.address;
  }

  getIntegralSalarary(): boolean {
    return this.integral_salarary;
  }

  getSalary(): string {
    return this.salary;
  }

  getEmail(): string {
    return this.email;
  }

  setSubTypeWorkerId(subTypeWorkerId: string) {
    this.sub_type_worker_id = subTypeWorkerId;
  }
} 