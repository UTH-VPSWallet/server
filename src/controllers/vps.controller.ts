import { Hono } from 'hono';
import { VPSService } from '../services/vps.service';
import { VPSRepository } from '../repositories/vps.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Res } from '../dtos/res.dto';
import { ERRORS, SUPPLIER, VPS } from '../constants/text.constant';
import { GetBySupplierReq, VPSAddReq, VPSDeleteReq, VPSGetByIDReq, VPSUpdateReq } from '../dtos/vps.dto';
import { httpCodes } from '../constants/enum.constant';

export const VPSController = new Hono<{ Bindings: { DB: D1Database } }>();

//------------------------------------------------------------ SUPPLIER ------------------------------------------------------------

VPSController.post('/supplier/get-all', async (c) => {
    let req = null;
    try { req = await c.req.json<GetBySupplierReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
    return withService(c, service => service.GetBySupplier(req));
});

VPSController.post('/supplier/add', async (c) => {
    let req = null;
    try { req = await c.req.json<VPSAddReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.Email)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.EMAIL_REQUIRED });
    if (!req.Name)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.NAME_REQUIRED });
    if (!req.CPU)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.CPU_REQUIRED });
    if (!req.RAM)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.RAM_REQUIRED });
    if (!req.Storage)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.STRORAGE_REQUIRED });
    if (!req.PricePerMonth)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.PRICEMONTH_REQUIRED });
    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.Add(req);
    return c.json(result);
});

VPSController.post('/supplier/edit', async (c) => {
    let req = null;
    try { req = await c.req.json<VPSUpdateReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.ID)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.ID_REQUIRED });
    if (!req.Name)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.NAME_REQUIRED });
    if (!req.CPU)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.CPU_REQUIRED });
    if (!req.RAM)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.RAM_REQUIRED });
    if (!req.Storage)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.STRORAGE_REQUIRED });
    if (!req.PricePerMonth)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.PRICEMONTH_REQUIRED });
    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.Edit(req);
    return c.json(result);
});

VPSController.post('/supplier/remove', async (c) => {
    let req = null;
    try { req = await c.req.json<VPSDeleteReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.ID)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.ID_REQUIRED });
    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.Remove(req);
    return c.json(result);
});

//------------------------------------------------------------ CUSTOMER ------------------------------------------------------------

VPSController.get('/customer/get-all', async (c) => withService(c, service => service.GetByStatus()))

//------------------------------------------------------------ GENERAL ------------------------------------------------------------

VPSController.post('/get-by-id', async (c) => {
    let req = null;
    try { req = await c.req.json<VPSGetByIDReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.ID)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.ID_REQUIRED });
    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.GetByID(req);
    return c.json(result);
});

//------------------------------------------------------------ PRIVATE ------------------------------------------------------------

const withService = async (c: any, handler: (service: VPSService) => Promise<Res>) => {
  try {
    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const data = await handler(service);
    return c.json(data)
  } catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
}