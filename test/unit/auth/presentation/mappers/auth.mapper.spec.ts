import { AuthMapper } from '@/auth/presentation/mappers/auth.mapper';
import { LoginDto as PresentationLoginDto } from '@/auth/presentation/dtos/login.dto';

describe('AuthMapper', () => {
  describe('presentationToApplicationLogin', () => {
    it('debe mapear correctamente de presentation DTO a application DTO', () => {
      // Arrange
      const presentationDto: PresentationLoginDto = {
        username: 'testuser',
        password: 'password123'
      };

      // Act
      const result = AuthMapper.presentationToApplicationLogin(presentationDto);

      // Assert
      expect(result).toEqual({
        username: 'testuser',
        password: 'password123'
      });
    });
  });

  describe('applicationToPresentationAuth', () => {
    it('debe mapear correctamente de application response a presentation DTO', () => {
      // Arrange
      const applicationResponse = {
        access_token: 'jwt.token.here',
        user: {
          id: 'uuid-123',
          username: 'testuser',
          name: 'Test User',
          role: 'ADMIN'
        }
      };

      // Act
      const result = AuthMapper.applicationToPresentationAuth(applicationResponse);

      // Assert
      expect(result).toEqual({
        user: {
          id: 'uuid-123',
          username: 'testuser',
          name: 'Test User',
          role: 'ADMIN'
        },
        token: 'jwt.token.here',
        expiresIn: 3600
      });
    });

    it('debe usar username como name cuando name no está disponible', () => {
      // Arrange
      const applicationResponse = {
        access_token: 'jwt.token.here',
        user: {
          id: 'uuid-123',
          username: 'testuser',
          role: 'USER'
        }
      };

      // Act
      const result = AuthMapper.applicationToPresentationAuth(applicationResponse);

      // Assert
      expect(result.user.name).toBe('testuser');
    });
  });
}); 