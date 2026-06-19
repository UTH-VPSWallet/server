import { Hono } from 'hono';
import { OrderService } from '../services/order.service';
import { OrderRepository } from '../repositories/order.repository';
import { GetOrdersByCustomerEmailReq, GetOrdersByIDReq, GetOrderBySupplierReq, OrderCancelReq, OrderCreateReq, OrderUpdateStatusReq } from '../dtos/order.dto';
import { ERRORS, ORDER } from '../constants/text.constant';
import { httpCodes } from '../constants/enum.constant';
import { Res } from '../dtos/res.dto';

export const OrderController = new Hono<{ Bindings: { DB: D1Database } }>();

//------------------------------------------------------------ SUPPLIER ------------------------------------------------------------

OrderController.post('/supplier/get-all', async (c) => {
    let req = null;
    try { req = await c.req.json<GetOrderBySupplierReq>() } 
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: ORDER.SUPPLIER_EMAIL_REQUIRED });
    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    return c.json(await service.GetBySupplier(req));
});

//------------------------------------------------------------ CUSTOMER ------------------------------------------------------------

OrderController.post('/customer/add', async (c) => {
    let req = null;
    try { req = await c.req.json<OrderCreateReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.CustomerEmail)  return c.json({ Status: httpCodes.BadRequest, Message: ORDER.CUSTOMER_EMAIL_REQUIRED });
    if (!req.VPS || !Array.isArray(req.VPS) || req.VPS.length === 0)  return c.json({ Status: httpCodes.BadRequest, Message: ORDER.VPS_REQUIRED });

    for (const item of req.VPS) {
        if (!item.VPSID) return c.json({ Status: httpCodes.BadRequest, Message: ORDER.VPSID_REQUIRED });
        if (!item.TotalMonth) return c.json({ Status: httpCodes.BadRequest, Message: ORDER.TOTALMONTH_REQUIRED });
        if (!item.TotalPrice) return c.json({ Status: httpCodes.BadRequest, Message: ORDER.TOTALPRICE_REQUIRED });
    }
   
    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    const result = await service.Add(req);
    return c.json(result);
});

OrderController.post('/get-by-customer', async (c) => {
    let req = null;
    try { req = await c.req.json<GetOrdersByCustomerEmailReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: ORDER.ID_REQUIRED }, httpCodes.OK)
    return withService(c, service => service.GetByCustomerEmail(req));
});

OrderController.post('/customer/cancel', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<OrderCancelReq>();
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest); 
    }

    if (!req.ID) {
        return c.json({ Status: httpCodes.BadRequest, Message: ORDER.ID_REQUIRED });
    }

    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    const result = await service.Cancel(req);
    return c.json(result);
});

//------------------------------------------------------------ ADMIN ------------------------------------------------------------

OrderController.get('/admin/get-all', async (c) => {
    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    return c.json(await service.GetAll());
});

//------------------------------------------------------------ GENERAL ------------------------------------------------------------

OrderController.post('/get-by-id', async (c) => {
    let req = null;
    try { req = await c.req.json<GetOrdersByIDReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if(!req.ID) return c.json({ Status: httpCodes.BadRequest, Message: ORDER.ID_REQUIRED }, httpCodes.OK)
    return withService(c, service => service.GetByID(req));
});

OrderController.post('/update-status', async (c) => {
    let req = null;
    try { req = await c.req.json<OrderUpdateStatusReq>() }
    catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
    if (!req.ID)  return c.json({ Status: httpCodes.BadRequest, Message: ORDER.ID_REQUIRED });
    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    const result = await service.UpdateStatus(req);
    return c.json(result);
});

//------------------------------------------------------------ PRIVATE ------------------------------------------------------------

const withService = async (c: any, handler: (service: OrderService) => Promise<Res>) => {
  try {
    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    const data = await handler(service);
    return c.json(data)
  } catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
}