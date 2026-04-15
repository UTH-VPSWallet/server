import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerAddReq, CustomerLoginReq, CustomerLoginRes, CustomerRes } from '../dtos/customer.dto';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';
import { CONSTANTS } from '../constants/text.constant';
import { generateJWT } from '../utils/jwt.util';

export class CustomerService {

    constructor(private repo: CustomerRepository) {}

    async Login(req: CustomerLoginReq): Promise<ResData<CustomerLoginRes>> {
        const customer = await this.repo.SelectByEmailPass(req);
        if(customer.Status !== httpCodes.OK) return {Status: customer.Status, Message: customer.Message, Data: { Name: '', Token: '' }};
        const jwtSecret = CONSTANTS.JWTSECRET;
        const token = await generateJWT(
            { 
                Email: customer.Data.Email,
                date: new Date()
            },
            jwtSecret,
            3600 * 24 * 365
        );
        return {Status: customer.Status, Message: customer.Message, Data: { Name: customer.Data.Name, Token: token }};
    }

    async Add(req: CustomerAddReq): Promise<Res> { return await this.repo.Create(req) }

    async GetAll(): Promise<ResData<CustomerRes[]>> {
        return await this.repo.GetAll();
    }
}