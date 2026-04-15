import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerLoginReq, CustomerLoginRes, CustomerRes } from '../dtos/customer.dto';
import { ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';
import { CONSTANTS } from '../constants/text.constant';
import { generateJWT } from '../utils/jwt.util';

export class CustomerService {

    constructor(private repo: CustomerRepository) {}

    async Login(req: CustomerLoginReq): Promise<ResData<CustomerLoginRes>> {
        const user = await this.repo.SelectByEmailPass(req);
        if(user.Status !== httpCodes.OK) return {Status: user.Status, Message: user.Message, Data: { Name: '', Token: '' }};
        const jwtSecret = CONSTANTS.JWTSECRET;
        const token = await generateJWT(
            { 
                Email: user.Data.Email,
                date: new Date()
            },
            jwtSecret,
            3600 * 24 * 365
        );
        return {Status: user.Status, Message: user.Message, Data: { Name: user.Data.Name, Token: token }};
    }

    async GetAll(): Promise<ResData<CustomerRes[]>> {
        return await this.repo.GetAll();
    }
}