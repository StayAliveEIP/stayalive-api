import { Types } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

/**
 * This method will hash the password given in parameter.
 * @param password The password to hash.
 */
export const cryptPassword = (password: string): string => {
  return hashSync(password, 10);
};

/**
 * This method will verify the password given in parameter matches the encrypted password given in parameter.
 * @param passwordEncrypted The encrypted password.
 * @param passwordClear The password to verify.
 */
export const verifyPassword = (
  passwordEncrypted: string,
  passwordClear: string,
): boolean => {
  return compareSync(passwordClear, passwordEncrypted);
};

// Token

/**
 * This method will generate a token for the user given in parameter.
 * @param id The id of the user.
 */
export const generateToken = (id: Types.ObjectId): string => {
  const jwtSecret: string = process.env.JWT_SECRET;
  return sign({ id }, jwtSecret, { expiresIn: '7d', algorithm: 'HS256' });
};

/**
 * This method will verify the token given in parameter.
 * @param token The token to verify.
 * @returns The id of the user if the token is valid, null otherwise.
 */
export const verifyToken = (token: string): Types.ObjectId | null => {
  const jwtSecret: string = process.env.JWT_SECRET;
  try {
    const decoded: any = verify(token, jwtSecret);
    if (!decoded.id) return null;
    return decoded.id;
  } catch (e) {
    return null;
  }
};
