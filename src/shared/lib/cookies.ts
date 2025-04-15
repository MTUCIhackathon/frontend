import { serialize } from 'cookie';

export const setAuthCookies = (res: any, accessToken: string, refreshToken: string) => {
  res.setHeader('Set-Cookie', [
    serialize('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 15, 
    }),
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, 
    }),
  ]);
};
