import { Hono } from 'hono';
import { VPSService } from '../services/vps.service';
import { VPSRepository } from '../repositories/vps.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Res } from '../dtos/res.dto';
import { ERRORS } from '../constants/text.constant';

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

VPSController.get('/supplier/get-vps', AuthMiddleware, async (c) => {
    const user = c.get('user');
    const supplierEmail = user.Email;

    const repo = new VPSRepository(c.env.DB);
    const service = new VPSService(repo);
    const result = await service.GetBySupplier(supplierEmail);
  
    return c.json(result);
});