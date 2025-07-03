import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/infrastructure/adapters/input/modules/auth.module';
import { UserDian } from '@/auth/domain/entities/userDian.entity';
import { Administrator } from '@/catalog/domain/entities/administrator.entity';
import { EXTERNAL_API_SERVICE } from '@/company/domain/services/company-environment.service.interface';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(TypeOrmModule)
    .useValue({
      forRoot: () => ({
        module: TypeOrmModule,
      }),
    })
    .compile();
  }, 30000);

  it('debería estar definido', () => {
    expect(module).toBeDefined();
    expect(EXTERNAL_API_SERVICE).toBe('EXTERNAL_API_SERVICE');
  });

  it('debería importar ServeStaticModule', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    const serveStaticConfig = moduleMetadata.find(
      (imported: any) => imported?.module === ServeStaticModule
    );

    expect(serveStaticConfig).toBeDefined();
    expect(serveStaticConfig?.module).toBe(ServeStaticModule);
  });

  it('debería importar AuthModule', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    const authModuleImport = moduleMetadata.find(
      (imported: any) => imported === AuthModule
    );

    expect(authModuleImport).toBeDefined();
    expect(authModuleImport).toBe(AuthModule);
  });

  it('debería importar TypeOrmModule', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    const typeOrmConfig = moduleMetadata.find(
      (imported: any) => imported?.module === TypeOrmModule
    );

    expect(typeOrmConfig).toBeDefined();
    expect(typeOrmConfig?.module).toBe(TypeOrmModule);
  });

  it('no debería tener controladores', () => {
    const moduleMetadata = Reflect.getMetadata('controllers', AppModule);
    expect(moduleMetadata).toEqual([]);
  });

  it('no debería tener proveedores', () => {
    const moduleMetadata = Reflect.getMetadata('providers', AppModule);
    expect(moduleMetadata).toEqual([]);
  });

  it('debería tener los módulos importados', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    
    // Verificar que todos los módulos están presentes
    const modules = moduleMetadata.map((imported: any) => 
      imported?.module || imported
    );

    // Verificar la presencia de cada módulo
    const moduleTypes = modules.map((module: any) => 
      module?.name || module?.constructor?.name || 'Unknown'
    );

    expect(moduleTypes).toContain('ServeStaticModule');
    expect(moduleTypes).toContain('AuthModule');
    expect(moduleTypes).toContain('TypeOrmModule');
  });

  it('debería tener la configuración correcta de TypeOrmModule', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    const typeOrmConfig = moduleMetadata.find(
      (imported: any) => imported?.module === TypeOrmModule
    );

    expect(typeOrmConfig).toBeDefined();
    expect(typeOrmConfig?.module).toBe(TypeOrmModule);
  });

  it('debería tener la configuración correcta de ServeStaticModule', () => {
    const moduleMetadata = Reflect.getMetadata('imports', AppModule);
    const serveStaticConfig = moduleMetadata.find(
      (imported: any) => imported?.module === ServeStaticModule
    );

    expect(serveStaticConfig).toBeDefined();
    expect(serveStaticConfig?.module).toBe(ServeStaticModule);
  });
}); 