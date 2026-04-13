import { Hono } from 'hono';
import { OrderService } from '../services/order.service';
import { OrderRepository } from '../repositories/order.repository';
import { GetOrdersBySupplierReq, OrderCreateReq, OrderUpdateStatusReq } from '../dtos/order.dto';
import { ERRORS, Order } from '../constants/text.constant';
import { httpCodes } from '../constants/enum.constant';

export const OrderController = new Hono<{ Bindings: { DB: D1Database } }>();

OrderController.post('/supplier/get-orders', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<GetOrdersBySupplierReq>() 
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest); 
    }

    if (!req.Email) {
        return c.json({ Status: httpCodes.BadRequest, Message: Order.SUPPLIER_EMAIL_REQUIRED });
    }

    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    return c.json(await service.GetBySupplier(req));
});

OrderController.post('/create', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<OrderCreateReq>() 
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest); 
    }

    if (!req.CustomerEmail) {
        return c.json({ Status: httpCodes.BadRequest, Message: Order.CUSTOMER_EMAIL_REQUIRED });
    }

    if (!req.VPSID) {
        return c.json({ Status: httpCodes.BadRequest, Message: Order.VPSID_REQUIRED });
    }

    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    return c.json(await service.Create(req));
});

OrderController.post('/update-status', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<OrderUpdateStatusReq>() 
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest); 
    }

    if (!req.ID) {
        return c.json({ Status: httpCodes.BadRequest, Message: Order.ORDER_ID_REQUIRED });
    }

    const repo = new OrderRepository(c.env.DB);
    const service = new OrderService(repo);
    return c.json(await service.UpdateStatus(req));
});