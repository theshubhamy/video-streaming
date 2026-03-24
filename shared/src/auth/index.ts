import jwt, { SignOptions } from 'jsonwebtoken';

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export const generateToken = (payload: object, secret: string, expiresIn: string | number = '1h') => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};
