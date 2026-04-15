import { Hono } from 'hono'
import { CreateReq, SupplierEditPassReq, SupplierLoginReq, SupplierRes, UpdatePassSupplierByEmailPhoneReq, UpdateReq } from '../dtos/supplier.dto'
import { SupplierService } from '../services/supplier.service'
import {SupplierRepository } from '../repositories/supplier.repository'
import { Res, ResData } from '../dtos/res.dto'
import { ERRORS, SUPPLIER } from '../constants/text.constant'
import { httpCodes } from '../constants/enum.constant'

export const SupplierController = new Hono<{ Bindings: { DB: D1Database, JWT_SECRET: string } }>()

//------------------------------------------------------------ SUPPLIER ------------------------------------------------------------

SupplierController.post('/login', async (c) =>{
  let req = null;
  try { req = await c.req.json<SupplierLoginReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.PWD_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.Login(req));
})

SupplierController.post('/change-pass', async (c) =>{
  let req = null;
  try { req = await c.req.json<SupplierEditPassReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.PWD_REQUIRED }, httpCodes.OK)
  if(!req.PassNew) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.NEW_PWD_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.ChangePass(req));
})

SupplierController.post('/forgot-pass', async (c) =>{
  let req = null;
  try { req = await c.req.json<UpdatePassSupplierByEmailPhoneReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Phone) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.PHONE_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.ForgotPass(req));
})


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
    const service = new SupplierService(repo);
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
    const service = new SupplierService(repo);
    const result = await service.Update(req);
    
    return c.json(result);
});

SupplierController.get('/get-by-email', async (c) => {
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
    const service = new SupplierService(repo);
    const result = await service.GetByEmail(req);
    
    return c.json(result);
});

//------------------------------------------------------------ PRIVATE ------------------------------------------------------------

const withService = async (c: any, handler: (service: SupplierService) => Promise<Res>) => {
  try {
    const repo = new SupplierRepository(c.env.DB);
    const service = new SupplierService(repo);
    const data = await handler(service);
    return c.json(data)
  } catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
}