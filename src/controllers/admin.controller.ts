import { Hono } from 'hono'
import { Res } from '../dtos/res.dto'
import { ERRORS, SUPPLIER } from '../constants/text.constant'
import { httpCodes } from '../constants/enum.constant'
import { AdminLoginReq } from '../dtos/admin.dto'
import { AdminService } from '../services/admin.service'
import { AdminRepository } from '../repositories/admin.repository'

export const AdminController = new Hono<{ Bindings: { DB: D1Database, JWT_SECRET: string } }>()

//------------------------------------------------------------ ADMIN ------------------------------------------------------------

AdminController.post('/login', async (c) =>{
  let req = null;
  try { req = await c.req.json<AdminLoginReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.PWD_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.Login(req));
})

//------------------------------------------------------------ PRIVATE ------------------------------------------------------------

const withService = async (c: any, handler: (service: AdminService) => Promise<Res>) => {
  try {
    const repo = new AdminRepository(c.env.DB);
    const service = new AdminService(repo);
    const data = await handler(service);
    return c.json(data)
  } catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
}