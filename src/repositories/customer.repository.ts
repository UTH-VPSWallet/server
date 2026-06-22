import { drizzle } from 'drizzle-orm/d1';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerAddReq, CustomerEditPassReq, CustomerLoginReq, CustomerRes, SelectCustomerEmailPassRes, SelectUserByEmailPhoneReq, SelectUserByEmailPhoneRes, UpdateUserPassReq } from '../dtos/customer.dto';
import { CUSTOMER, ERRORS, SUCCESS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes, LoginStatusRes } from '../constants/enum.constant';
import { and, eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export class CustomerRepository {

    SALT_ROUNDS: number = 10;

    constructor(private db: D1Database) {}

    async SelectByEmailPass(req: CustomerLoginReq): Promise<ResData<SelectCustomerEmailPassRes>>{
      const orm = drizzle(this.db);
      try{
        const [customer] = await orm.select().from(CustomerEntity).where(eq(CustomerEntity.Email, req.Email)).limit(1);
        if(!customer) return { Status: LoginStatusRes.EmailNotExist, Message: CUSTOMER.EMAIL_NOT_EXIST, Data: { Name: '' , Email: '' } }
        const checkPass = await bcrypt.compare(req.Pass, customer.Pass);
        if(!checkPass) return { Status: LoginStatusRes.PassWrong, Message: CUSTOMER.PASS_WRONG, Data: { Name: '' , Email: '' } }
        if(customer.Status === LoginStatusRes.Locked) return { Status: LoginStatusRes.Locked, Message: CUSTOMER.LOCKED, Data: { Name: '' , Email: '' } }
        if(customer.Status === LoginStatusRes.NotActive) return { Status: LoginStatusRes.NotActive, Message: CUSTOMER.NOT_ACTIVE, Data: { Name: '' , Email: '' } }
        if(customer.Status === httpCodes.OK) return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: {
        Email: customer.Email,
        Name: customer.Name
        }}
        return{ Status: httpCodes.UnidentifiedError, Message: ERRORS.GET, Data: { Name: '' , Email: '' } };
      } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: { Name: '' , Email: '' } } }
    }

    async UpdatePass(req: CustomerEditPassReq): Promise<Res> {
      const orm = drizzle(this.db);
      try{
        const [existing] = await orm.select().from(CustomerEntity).where(eq(CustomerEntity.Email, req.Email)).limit(1);
        if (!existing) return { Status: LoginStatusRes.EmailNotExist, Message: CUSTOMER.EMAIL_NOT_EXIST }
        const checkPass = await bcrypt.compare(req.Pass, existing.Pass);
        if(!checkPass) return { Status: LoginStatusRes.PassWrong, Message: CUSTOMER.PASS_WRONG }
        const hashPass = await bcrypt.hash(req.PassNew, this.SALT_ROUNDS);
        const update = await orm.update(CustomerEntity).set({ Pass: hashPass }).where(eq(CustomerEntity.Email, req.Email));
        if(update) return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
        return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
      } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR } }
    }

    async Create(req: CustomerAddReq): Promise<Res> {
      const orm = drizzle(this.db);
      const hashPass = await bcrypt.hash(req.Pass, this.SALT_ROUNDS);
      try {
        const result = await orm.insert(CustomerEntity).values({
          Email: req.Email,
          Name: req.Name,
          Pass: hashPass,
          Phone: req.Phone,
          Status: httpCodes.OK
        }).returning({ ID: CustomerEntity.Email });
        if(result) return { Status : httpCodes.OK, Message: SUCCESS.CREATE };
        else return { Status : httpCodes.ServiceUnavailable, Message: ERRORS.CREATE }; 
      } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }

    async GetAll(): Promise<ResData<CustomerRes[]>> {
      const orm = drizzle(this.db);
      try {
        const results = await orm.select({
            Email: CustomerEntity.Email,
            Name: CustomerEntity.Name,
            Status: CustomerEntity.Status
        }).from(CustomerEntity);
        return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
      } catch { return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] } }
    }

    async SelectCustomerByEmailPhone(req: SelectUserByEmailPhoneReq): Promise<Res>{
    const orm = drizzle(this.db);
    let res = new ResData<SelectUserByEmailPhoneRes>();
    try {
      const [user] = await orm.select().from(CustomerEntity).where(and(
        eq(CustomerEntity.Email, req.Email),
        eq(CustomerEntity.Phone, req.Phone)
      )).limit(1);
      if(!user){
        res.Status = 5008;
        res.Message = CUSTOMER.EMAIL_NOT_EXIST;
        return res;
      }
      if(user.Status != 200){
        res.Status = user.Status;
        res.Message = CUSTOMER.LOCKED;
        return res;
      }
      res.Status = httpCodes.OK;
      res.Message = SUCCESS.GET;
      res.Data = {
        Email: user.Email,
        Name: user.Name
      };
      return res;
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
  }

  async UpdateUserPass(req: UpdateUserPassReq): Promise<Res>{
    const orm = drizzle(this.db);
    let res = new Res();
    try {
      const result = await orm.update(CustomerEntity).set({
        Pass: await bcrypt.hash(req.Pass, this.SALT_ROUNDS),
        //PassVer: sql`${CustomerEntity.PassVer} + 1`,
      }).where(eq(CustomerEntity.Email, req.Email));
      if(!result.success) {
        res.Status = httpCodes.InternalServerError;
        res.Message = ERRORS.INTERNALSERVERERROR;
        return res;
      }
      res.Status = httpCodes.OK;
      res.Message = SUCCESS.UPDATE;
      return res;
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
  }

}