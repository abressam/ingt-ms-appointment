import { sign, verify, JwtPayload, Secret } from 'jsonwebtoken';
import * as Crypto from 'crypto';

export function getJsonWebToken(
  cpfCnpj: string,
  crp: string | null,
  responsibleCrp: string | null,
  patientId: number | null,
  secret: Secret,
): string {
  return sign({ cpfCnpj, crp, responsibleCrp, patientId }, secret, { expiresIn: '1d' });
}

export function checkJsonWebToken(
  token: string,
  secret: Secret,
): string | JwtPayload {
  return verify(token, secret);
}

export function encodePassword(salt: string, password: string): string {
  return Crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}