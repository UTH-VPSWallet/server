import { Hono } from 'hono';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerService } from '../services/customer.service';
import { Res } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';
import { CUSTOMER, ERRORS } from '../constants/text.constant';
import { CustomerAddReq, CustomerEditPassReq, CustomerLoginReq, ForgotPassReq } from '../dtos/customer.dto';
import { GeneralService } from '../services/general.service';

export const CustomerController = new Hono<{ Bindings: { DB: D1Database } }>();

//------------------------------------------------------------ CUSTOMER ----------------------------------------------------------------------

CustomerController.post('/login', async (c) =>{
  let req = null;
  try { req = await c.req.json<CustomerLoginReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.PWD_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.Login(req));
})

CustomerController.post('/change-pass', async (c) =>{
  let req = null;
  try { req = await c.req.json<ForgotPassReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Phone) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.PHONE_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.ForgotPass(req));
})

CustomerController.post('/forgot-pass', async (c) =>{
  let req = null;
  try { req = await c.req.json<CustomerEditPassReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.PWD_REQUIRED }, httpCodes.OK)
  if(!req.PassNew) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.NEW_PWD_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.ChangePass(req));
})

CustomerController.post('/add', async (c) =>{
  let req = null;
  try { req = await c.req.json<CustomerAddReq>() }
  catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
  if(!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.EMAIL_REQUIRED }, httpCodes.OK)
  if(!req.Pass) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.PWD_REQUIRED }, httpCodes.OK)
  if(!req.Name) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.NAME_REQUIRED }, httpCodes.OK)
  if(!req.Phone) return c.json({ Status: httpCodes.BadRequest, Message: CUSTOMER.PHONE_REQUIRED }, httpCodes.OK)
  return withService(c, service => service.Add(req));
})

CustomerController.get('/get-all', async (c) => { return withService(c, service => service.GetAll()) });

//------------------------------------------------------------ PRIVATE ------------------------------------------------------------

const withService = async (c: any, handler: (service: CustomerService) => Promise<Res>) => {
  try {
    const repo = new CustomerRepository(c.env.DB);
    const generalSer = new GeneralService();
    const service = new CustomerService(repo, generalSer);
    const data = await handler(service);
    return c.json(data)
  } catch { return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) }
}