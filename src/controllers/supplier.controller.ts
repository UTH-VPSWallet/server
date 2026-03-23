import { Hono } from 'hono'
import { SupplierLoginReq } from '../dtos/supplier.dto'
import { SupplierService } from '../services/supplier.service'
import {SupplierRepository } from '../repositories/supplier.repository'
import { Res } from '../dtos/res.dto'
import { ERRORS, SUPPLIER } from '../constants/text.constant'

export const SupplierController = new Hono<{ Bindings: { DB: D1Database, JWT_SECRET: string } }>()

SupplierController.post('/login', async (c) =>{
  let req = null;
  let res = new Res();
  try { req = await c.req.json<SupplierLoginReq>() }
  catch {
    res.Status = 4000;
    res.Message = ERRORS.ERROR_4000;
    return c.json(res);
  }
  if(!req.email){
    res.Status = 4001;
    res.Message = SUPPLIER.ERROR_4001;
    return c.json(res);
  }
  if(!req.pass){
    res.Status = 4002;
    res.Message = SUPPLIER.ERROR_4002;
    return c.json(res);
  }
  return withService(c, service => service.SupplierLogin(req));
})

const withService = async (c: any, handler: (service: SupplierService) => Promise<Res>) => {
  try {
    const repo = new SupplierRepository(c.env.DB);
    const service = new SupplierService(repo, c.env.JWT_SECRET);
    const data = await handler(service);
    return c.json(data)
  } catch (err) {
    console.error('Lỗi SupplierController:', err);
    return c.json({ TrangThai: 500, ThongBao: 'Lỗi đầu vào!' })
  }
}
