import config from 'config';
import { Request } from 'express';
import { GetVerificationKey, expressjwt } from 'express-jwt';
import JwksClient from 'jwks-rsa';
import { TAuthCookie } from '../types';

export default expressjwt({
  secret: JwksClient.expressJwtSecret({
    jwksUri: config.get('auth.jwksUri'),
    cache: true,
    rateLimit: true
  }) as GetVerificationKey,

  algorithms: ['RS256'],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;

    if (
      authHeader?.startsWith('Bearer') &&
      authHeader.split(' ')[1] !== undefined
    ) {
      const token = authHeader.split(' ')[1];

      if (token) return token;
    }

    const { accessToken } = req.cookies as TAuthCookie;
    return accessToken;
  }
});
