import { validate } from 'class-validator';
import { UpdateEnvironmentDto } from '@/company/application/ports/input/dtos/update-environment.dto';

describe('UpdateEnvironmentDto', () => {
  let dto: UpdateEnvironmentDto;

  beforeEach(() => {
    dto = new UpdateEnvironmentDto();
  });

  it('debería ser válido con todos los campos opcionales y token', async () => {
    dto.type_environment_id = 2;
    dto.payroll_type_environment_id = 2;
    dto.eqdocs_type_environment_id = 2;
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería ser válido solo con el token', async () => {
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería ser inválido sin token', async () => {
    dto.type_environment_id = 2;
    dto.payroll_type_environment_id = 2;
    dto.eqdocs_type_environment_id = 2;

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('token');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('debería ser inválido con type_environment_id no numérico', async () => {
    dto.type_environment_id = '2' as any;
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('type_environment_id');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('debería ser inválido con payroll_type_environment_id no numérico', async () => {
    dto.payroll_type_environment_id = '2' as any;
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('payroll_type_environment_id');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('debería ser inválido con eqdocs_type_environment_id no numérico', async () => {
    dto.eqdocs_type_environment_id = '2' as any;
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('eqdocs_type_environment_id');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('debería ser válido con valores numéricos negativos', async () => {
    dto.type_environment_id = -1;
    dto.payroll_type_environment_id = -1;
    dto.eqdocs_type_environment_id = -1;
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería ser válido con valores numéricos decimales', async () => {
    dto.type_environment_id = 2.5;
    dto.payroll_type_environment_id = 2.5;
    dto.eqdocs_type_environment_id = 2.5;
    dto.token = '1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
}); 