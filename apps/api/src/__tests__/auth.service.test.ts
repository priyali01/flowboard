import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecretPassword123';
      const hash = await authService.hashPassword(password);
      expect(hash).not.toBe(password);
      expect(hash).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const password = 'mySecretPassword123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'mySecretPassword123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword('wrongPassword', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('generateTokens', () => {
    it('should generate an access token and a refresh token', () => {
      const payload = { userId: '123' };
      const tokens = authService.generateTokens(payload);
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
    });
  });
});
