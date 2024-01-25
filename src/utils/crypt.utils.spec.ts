import * as bcrypt from 'bcrypt';
import {
  generateToken,
  hashPassword,
  randomPassword,
  verifyPassword,
  verifyToken,
} from './crypt.utils';
import { Types } from 'mongoose';
import { AccountType } from '../guards/auth.route.guard';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
  compareSync: jest.fn().mockReturnValue(true),
}));

process.env.JWT_SECRET = 'testing';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', () => {
      const password = 'TestPassword';
      const hashed = hashPassword(password);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, 10);
      expect(hashed).toBe('hashedPassword');
    });
  });

  describe('verifyPassword', () => {
    it('should verify a hashed password', () => {
      const password = 'TestPassword';
      const hashed = 'hashedPassword';
      const result = verifyPassword(hashed, password);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hashed);
      expect(result).toBe(true);
    });
  });

  describe('randomPassword', () => {
    it('should generate a random password of 10 characters', () => {
      const password = randomPassword();
      expect(password).toHaveLength(10);
    });
  });

  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mockedToken'),
    verify: jest.fn().mockImplementation(() => ({ id: 'mockedId' })),
  }));

  describe('JWT Utilities', () => {
    const mockId = new Types.ObjectId();

    describe('generateToken', () => {
      it('should generate a valid JWT', () => {
        generateToken(mockId, AccountType.ADMIN);
      });
    });

    describe('verifyToken', () => {
      it('should verify a valid JWT and return the user id', () => {
        const token = 'validToken';
        verifyToken(token);
      });

      it('should return null for an invalid token', () => {
        const decodedId = verifyToken('invalidToken');
        expect(decodedId).toBeNull();
      });
    });
  });
});
