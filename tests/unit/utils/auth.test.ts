import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { validateToken } from '@/utils/auth';

// Mock do módulo jose
vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
  createRemoteJWKSet: vi.fn()
}));

describe('utils/auth - validateToken', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables
    process.env = {
      ...originalEnv,
      COGNITO_USERPOOL_ID: 'us-east-1_TestPool',
      COGNITO_REGION: 'us-east-1'
    };

    // Mock console
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Configuração do ambiente', () => {
    it('deve lançar erro quando COGNITO_USERPOOL_ID não está definido', async () => {
      delete process.env.COGNITO_USERPOOL_ID;

      await expect(validateToken('any-token')).rejects.toThrow(
        'Missing required AWS Cognito configuration'
      );
    });

    it('deve lançar erro quando COGNITO_REGION não está definido', async () => {
      delete process.env.COGNITO_REGION;

      await expect(validateToken('any-token')).rejects.toThrow(
        'Missing required AWS Cognito configuration'
      );
    });

    it('deve lançar erro quando ambas variáveis não estão definidas', async () => {
      delete process.env.COGNITO_USERPOOL_ID;
      delete process.env.COGNITO_REGION;

      await expect(validateToken('any-token')).rejects.toThrow(
        'Missing required AWS Cognito configuration'
      );
    });
  });

  describe('Validação de token', () => {
    it('deve validar token com sucesso', async () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        'cognito:username': 'testuser',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: mockPayload });

      const token = 'valid.jwt.token';
      const result = await validateToken(token);

      expect(result).toEqual(mockPayload);
      expect(console.log).toHaveBeenCalledWith(
        'Attempting to validate token with JWKS URL:',
        expect.stringContaining('us-east-1_TestPool')
      );
    });

    it('deve construir JWKS URL corretamente', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      await validateToken('test-token');

      expect(createRemoteJWKSet).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TestPool/.well-known/jwks.json'
        })
      );
    });

    it('deve passar token e JWKS para jwtVerify', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      const mockJWKS = 'mock-jwks-set';
      (createRemoteJWKSet as any).mockReturnValue(mockJWKS);
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      const testToken = 'test.jwt.token';
      await validateToken(testToken);

      expect(jwtVerify).toHaveBeenCalledWith(testToken, mockJWKS);
    });
  });

  describe('Tratamento de erros', () => {
    it('deve lançar erro quando token é inválido', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockRejectedValue(new Error('Invalid token'));

      await expect(validateToken('invalid-token')).rejects.toThrow('Invalid token');

      expect(console.error).toHaveBeenCalledWith(
        'Token validation error:',
        expect.any(Error)
      );
    });

    it('deve lançar erro quando token expirou', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      const expiredError = new Error('Token expired');
      (expiredError as any).code = 'ERR_JWT_EXPIRED';
      (jwtVerify as any).mockRejectedValue(expiredError);

      await expect(validateToken('expired-token')).rejects.toThrow('Token expired');
    });

    it('deve lançar erro quando assinatura é inválida', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      const signatureError = new Error('Invalid signature');
      (signatureError as any).code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
      (jwtVerify as any).mockRejectedValue(signatureError);

      await expect(validateToken('tampered-token')).rejects.toThrow('Invalid signature');
    });

    it('deve lançar erro quando JWKS não pode ser carregado', async () => {
      const { createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockImplementation(() => {
        throw new Error('Failed to fetch JWKS');
      });

      await expect(validateToken('test-token')).rejects.toThrow('Failed to fetch JWKS');
    });
  });

  describe('Diferentes regiões e pools', () => {
    it('deve funcionar com região diferente', async () => {
      process.env.COGNITO_REGION = 'eu-west-1';
      process.env.COGNITO_USERPOOL_ID = 'eu-west-1_AnotherPool';

      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      await validateToken('test-token');

      expect(createRemoteJWKSet).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_AnotherPool/.well-known/jwks.json'
        })
      );
    });

    it('deve funcionar com diferentes formatos de pool ID', async () => {
      const poolIds = [
        'us-east-1_123456789',
        'us-west-2_ABCDEFGHI',
        'ap-southeast-1_XYZ123ABC'
      ];

      const { jwtVerify, createRemoteJWKSet } = await import('jose');
      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      for (const poolId of poolIds) {
        const region = poolId.split('_')[0];
        process.env.COGNITO_REGION = region;
        process.env.COGNITO_USERPOOL_ID = poolId;

        await validateToken('test-token');

        expect(createRemoteJWKSet).toHaveBeenCalledWith(
          expect.objectContaining({
            href: expect.stringContaining(poolId)
          })
        );
      }
    });
  });

  describe('Payload do token', () => {
    it('deve retornar payload completo com claims padrão', async () => {
      const mockPayload = {
        sub: 'user-id-123',
        email: 'user@example.com',
        email_verified: true,
        'cognito:username': 'username',
        'cognito:groups': ['admin', 'users'],
        aud: 'client-id',
        token_use: 'id',
        auth_time: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };

      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: mockPayload });

      const result = await validateToken('valid-token');

      expect(result).toEqual(mockPayload);
      expect(result.sub).toBe('user-id-123');
      expect(result.email).toBe('user@example.com');
      expect(result['cognito:groups']).toEqual(['admin', 'users']);
    });

    it('deve retornar payload com custom claims', async () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        'custom:role': 'admin',
        'custom:department': 'engineering',
        'custom:permissions': JSON.stringify(['read', 'write', 'delete'])
      };

      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: mockPayload });

      const result = await validateToken('token-with-custom-claims');

      expect(result['custom:role']).toBe('admin');
      expect(result['custom:department']).toBe('engineering');
    });
  });

  describe('Cenários de integração', () => {
    it('deve validar token em fluxo completo de autenticação', async () => {
      // Simula token real retornado por Cognito após login
      const realWorldPayload = {
        sub: '12345678-1234-1234-1234-123456789012',
        'cognito:groups': ['users'],
        email_verified: true,
        iss: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_TestPool`,
        'cognito:username': 'john.doe',
        aud: '1234567890abcdefghijklmnop',
        event_id: '12345678-abcd-efgh-ijkl-123456789012',
        token_use: 'id',
        auth_time: 1234567890,
        name: 'John Doe',
        exp: 1234571490, // 1 hora depois
        iat: 1234567890,
        email: 'john.doe@example.com'
      };

      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: realWorldPayload });

      const result = await validateToken('realistic.jwt.token');

      expect(result).toEqual(realWorldPayload);
      expect(result.email).toBe('john.doe@example.com');
      expect(result['cognito:username']).toBe('john.doe');
      expect(result.token_use).toBe('id');
    });

    it('deve lidar com múltiplas validações consecutivas', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: { sub: 'user-1' } });

      // Primeira validação
      const result1 = await validateToken('token-1');
      expect(result1.sub).toBe('user-1');

      // Segunda validação com payload diferente
      (jwtVerify as any).mockResolvedValue({ payload: { sub: 'user-2' } });
      const result2 = await validateToken('token-2');
      expect(result2.sub).toBe('user-2');

      // Terceira validação
      (jwtVerify as any).mockResolvedValue({ payload: { sub: 'user-3' } });
      const result3 = await validateToken('token-3');
      expect(result3.sub).toBe('user-3');

      expect(jwtVerify).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge cases', () => {
    it('deve lidar com token vazio', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockRejectedValue(new Error('Token is empty'));

      await expect(validateToken('')).rejects.toThrow();
    });

    it('deve lidar com token malformado', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockRejectedValue(new Error('Malformed JWT'));

      await expect(validateToken('not-a-jwt')).rejects.toThrow('Malformed JWT');
    });

    it('deve lidar com URL JWKS inválida', async () => {
      process.env.COGNITO_REGION = 'invalid region';
      process.env.COGNITO_USERPOOL_ID = 'invalid pool';

      const { createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      await expect(validateToken('test-token')).rejects.toThrow('Invalid URL');
    });

    it('deve logar tentativa de validação', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      await validateToken('test-token');

      expect(console.log).toHaveBeenCalledWith(
        'Attempting to validate token with JWKS URL:',
        expect.stringContaining('.well-known/jwks.json')
      );
    });

    it('deve preservar stack trace do erro original', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');

      const originalError = new Error('Original validation error');
      originalError.stack = 'Original stack trace';
      (jwtVerify as any).mockRejectedValue(originalError);

      try {
        await validateToken('test-token');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBe(originalError);
        expect((error as Error).stack).toBe('Original stack trace');
      }
    });
  });

  describe('Performance', () => {
    it('deve criar JWKS apenas uma vez por validação', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      await validateToken('test-token');

      expect(createRemoteJWKSet).toHaveBeenCalledTimes(1);
    });

    it('deve completar validação rapidamente', async () => {
      const { jwtVerify, createRemoteJWKSet } = await import('jose');

      (createRemoteJWKSet as any).mockReturnValue('mock-jwks');
      (jwtVerify as any).mockResolvedValue({ payload: {} });

      const startTime = Date.now();
      await validateToken('test-token');
      const endTime = Date.now();

      // Validação deve ser rápida (menos de 100ms em mock)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
