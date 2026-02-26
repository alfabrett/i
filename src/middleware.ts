export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/convocatorias/:path*', '/solicitudes/:path*']
};
