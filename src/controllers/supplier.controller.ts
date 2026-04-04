import { Hono } from 'hono'
import { CreateReq, SupplierLoginReq, SupplierRes, UpdateReq } from '../dtos/supplier.dto'
import { SupplierService } from '../services/supplier.service'
import {SupplierRepository } from '../repositories/supplier.repository'
import { Res, ResData } from '../dtos/res.dto'
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
  return withService(c, service => service.Login(req));
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


SupplierController.get('/get-all', async (c) => withService(c, service => service.GetAll()))

SupplierController.post('/create', async (c) => {
    let req = null;
    let res = new Res();

    try {
        req = await c.req.json<CreateReq>();
    } catch {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    if (!req.Email) {
        res.Status = 6003;
        res.Message = "Bắt buộc phải nhập email"
        return c.json(res);
    }

    const repo = new SupplierRepository(c.env.DB);
    const service = new SupplierService(repo,c.env.JWT_SECRET);
    const result = await service.Create(req);
    
    return c.json(result);
});

SupplierController.put('/update', async (c) => {
    let req = null;
    let res = new Res();

    try {
        req = await c.req.json<UpdateReq>();
    } catch {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    if (!req.Email) {
        res.Status = 5003;
        res.Message = "Bắt buộc phải nhập email"
        return c.json(res);
    }

    const repo = new SupplierRepository(c.env.DB);
    const service = new SupplierService(repo,c.env.JWT_SECRET);
    const result = await service.Update(req);
    
    return c.json(result);
});

SupplierController.get('/get-by-email/:email', async (c) => {
    let req = null;
    let res = new ResData<SupplierRes>();

    try {
        req = await c.req.json<string>();
    } catch {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    if (!req) {
        res.Status = 5003;
        res.Message = "Bắt buộc phải nhập email"
        return c.json(res);
    }

    const repo = new SupplierRepository(c.env.DB);
    const service = new SupplierService(repo,c.env.JWT_SECRET);
    const result = await service.GetByEmail(req);
    
    return c.json(result);
});