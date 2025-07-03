import { Injectable, UnauthorizedException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { LoginDto } from '@/auth/application/ports/input/dtos/login.dto';
import { InternalLoginDataDto } from '@/auth/application/ports/input/dtos/login-data.dto';
import { HostBlockService } from '@/auth/domain/services/security/host-block.service';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '@/auth/domain/repositories/user.repository.interface';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly hostBlockService: HostBlockService,
  ) {}

  async execute(loginDto: LoginDto, ip: string): Promise<InternalLoginDataDto> {
    this.logger.debug(`Procesando login para IP: ${ip}`);

    // Verificar si la IP está bloqueada
    if (this.hostBlockService.isHostBlocked(ip)) {
      const remainingTime = this.hostBlockService.getRemainingBlockTime(ip);
      this.logger.warn(`IP ${ip} está bloqueada. Tiempo restante: ${remainingTime} minutos`);
      throw new HttpException(
        `Demasiados intentos fallidos. Por favor, intente nuevamente en ${remainingTime} minutos.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    try {
      const user = await this.userRepository.findByUsername(loginDto.username);
      if (!user) {
        this.logger.debug(`Usuario no encontrado para IP ${ip}`);
        this.hostBlockService.recordFailedAttempt(ip);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        this.logger.debug(`Contraseña inválida para IP ${ip}`);
        this.hostBlockService.recordFailedAttempt(ip);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Si el login es exitoso, resetear los intentos fallidos
      this.logger.debug(`Login exitoso para IP ${ip}. Reseteando intentos fallidos.`);
      this.hostBlockService.resetAttempts(ip);

      const payload = { 
        sub: user.id,
        email: user.email,
        role: user.role
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          company_document: user.company_document,
          first_name_person_responsible: user.first_name_person_responsible,
          last_name_person_responsible: user.last_name_person_responsible,
          job_title_person_responsible: user.job_title_person_responsible,
          organization_department_person_responsible: user.organization_department_person_responsible,
          document_person_responsible: user.document_person_responsible
        }
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Error inesperado durante el login para IP ${ip}:`, error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 