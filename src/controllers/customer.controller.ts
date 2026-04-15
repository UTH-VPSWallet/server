import { Hono } from 'hono';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerService } from '../services/customer.service';
import { Res } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';
import { CUSTOMER, ERRORS } from '../constants/text.constant';
import { CustomerLoginReq } from '../dtos/customer.dto';

export const CustomerController = new Hono<{ Bindings: { DB: D1Database } }>();

//------------------------------------------------------------ SUPPLIER ------------------------------------------------------------

CustomerController.post('/login', async (c) =>{
  let req = null;
  try { req = await c.req.json<CustomerLoginReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.PWD_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.Login(req));
})

CustomerController.get('/get-all', async (c) => {
    const repo = new CustomerRepository(c.env.DB);
    const service = new CustomerService(repo);
    return c.json(await service.GetAll());
});

//------------------------------------------------------------ PRIVATE ------------------------------------------------------------

const withService = async (c: any, handler: (service: CustomerService) => Promise<Res>) => {
  try {
    const repo = new CustomerRepository(c.env.DB);
    const service = new CustomerService(repo);
    const data = await handler(service);
    return c.json(data)
  } catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
}