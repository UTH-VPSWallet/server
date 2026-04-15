import { drizzle } from 'drizzle-orm/d1';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerAddReq, CustomerLoginReq, CustomerRes, SelectCustomerEmailPassRes } from '../dtos/customer.dto';
import { CUSTOMER, ERRORS, SUCCESS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes, LoginStatusRes } from '../constants/enum.constant';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export class CustomerRepository {
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

    async Create(req: CustomerAddReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
        const result = await orm.insert(CustomerEntity).values({
            Email: req.Email,
            Name: req.Name,
            Pass: await bcrypt.hash(req.Pass, 10),
            Phone: req.Phone,
            Status: httpCodes.OK
        }).returning();
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
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] };
        }
    }
}