import { verifyJWT } from '../utils/jwt.util';
import { Context, Next } from 'hono';

export async function AuthMiddleware(c: Context<{
    Bindings: { JWT_SECRET: string } ; 
    Variables: { user: any }}>, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ TrangThai: 0, ThongBao: 'Thiếu token xác thực' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyJWT(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({ TrangThai: 0, ThongBao: 'Token không hợp lệ hoặc đã hết hạn' }, 401);
  }

  //Lưu thông tin người dùng vào context
  c.set('user', payload);

  await next();
}