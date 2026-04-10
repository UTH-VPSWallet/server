import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateReq, GetAllRes, SelectUserByEmailPassReq, SelectUserEmailPassRes, SupplierChangePassReq, SupplierLoginReq, SupplierLoginRes, SupplierRes, UpdateReq} from '../dtos/supplier.dto';
import { Res, ResData } from '../dtos/res.dto';
import { generateJWT } from '../utils/jwt.util';
import { CONSTANTS } from '../constants/text.constant';
import { httpCodes } from '../constants/enum.constant';


export class  SupplierService {
  
  constructor(
    private repo: SupplierRepository
  ) {}

    async Login(req: SupplierLoginReq): Promise<ResData<SupplierLoginRes>> {
        const user: ResData<SelectUserEmailPassRes> = await this.repo.SelectSupplierByEmailPass(req);
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
    async ChangePass(req: SupplierChangePassReq): Promise<Res> {
        const supplierLoginReq: SupplierLoginReq = {
            Email: req.Email,
            Pass: req.Pass
        }
        const user: ResData<SelectUserEmailPassRes> = await this.repo.SelectSupplierByEmailPass(supplierLoginReq);
        if(user.Status !== httpCodes.OK) return {Status: user.Status, Message: user.Message};
        return {Status: user.Status, Message: user.Message, Data: { Name: user.Data.Name, Token: token }};
    }

    async GetAll(): Promise<ResData<GetAllRes[]>> {
        return await this.repo.GetAll();
    }

    async Create(req: CreateReq): Promise<Res> {
        return await this.repo.Create(req);
    }

    async Update(req: UpdateReq): Promise<Res> {
        return await this.repo.Update(req);
    }

    async GetByEmail(req: string): Promise<ResData<SupplierRes>> {
        return await this.repo.GetByEmail(req);
    }
}

