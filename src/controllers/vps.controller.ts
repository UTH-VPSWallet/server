import { Hono } from 'hono';
import { VPSService } from '../services/vps.service';
import { VPSRepository } from '../repositories/vps.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Res } from '../dtos/res.dto';
import { ERRORS, SUPPLIER, VPS } from '../constants/text.constant';
import { GetBySupplierReq, VPSAddReq } from '../dtos/vps.dto';
import { httpCodes } from '../constants/enum.constant';

export const VPSController = new Hono<{ Bindings: { DB: D1Database } }>();

VPSController.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    let res = new Res();
    
    if (isNaN(id)) {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.GetByVPSID(id);
  
    return c.json(result);
});

//------------------------------------------------------------ SUPPLIER ------------------------------------------------------------

VPSController.post('/supplier/get-all', async (c) => {
    let req = null;
    try { req = await c.req.json<GetBySupplierReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
    return withService(c, service => service.GetBySupplier(req));
});

VPSController.post('/create', async (c) => {
    let req = null;
    try { req = await c.req.json<VPSAddReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.Email)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.EMAIL_REQUIRED });
    if (!req.Name)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.NAME_REQUIRED });
    if (!req.CPU)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.CPU_REQUIRED });
    if (!req.RAM)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.RAM_REQUIRED });
    if (!req.Storage)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.STRORAGE_REQUIRED });
    if (!req.PricePerMonth)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.PRICEMONTH_REQUIRED });
    if (!req.Status)  return c.json({ Status: httpCodes.BadRequest, Message: VPS.STATUS_REQUIRED });
    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.Create(req);
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