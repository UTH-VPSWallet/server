import { Hono } from 'hono';
import { VPSService } from '../services/vps.service';
import { VPSRepository } from '../repositories/vps.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Res } from '../dtos/res.dto';
import { ERRORS, SUPPLIER } from '../constants/text.constant';
import { GetBySupplierReq } from '../dtos/vps.dto';
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

VPSController.get('/category/:categoryId', async (c) => {
    const categoryId = parseInt(c.req.param('categoryId'));
    let res = new Res();
    
    if (isNaN(categoryId)) {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.GetByCategoryID(categoryId);
  
    return c.json(result);
});

//------------------------------------------------------------ SUPPLIER ------------------------------------------------------------

VPSController.post('/supplier/get-all', AuthMiddleware, async (c) => {
    let req = null;
    try { req = await c.req.json<GetBySupplierReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: SUPPLIER.EMAIL_REQUIRED }, httpCodes.OK)
    return withService(c, service => service.GetBySupplier(req));
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