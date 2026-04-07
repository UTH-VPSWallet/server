import { SupplierRepository } from '../repositories/supplier.repository';
import { CreateReq, GetAllRes, SelectUserByEmailPassReq, SelectUserEmailPassRes, SupplierLoginReq, SupplierLoginRes, SupplierRes, UpdateReq} from '../dtos/supplier.dto';
import { Res, ResData } from '../dtos/res.dto';
import { generateJWT } from '../utils/jwt.util';
import { CONSTANTS } from '../constants/text.constant';


export class  SupplierService {
  
  constructor(
    private repo: SupplierRepository
  ) {}

    async Login(req: SupplierLoginReq): Promise<ResData<SupplierLoginRes>> {
        let res = new ResData<SupplierLoginRes>();
        const selectUserByEmailPassReq: SelectUserByEmailPassReq = {
            email: req.email,
            pass: req.pass
        }
        const user = await this.repo.SelectSupplierByEmailPass(selectUserByEmailPassReq) as ResData<SelectUserEmailPassRes>;
        res.Status = user.Status;
        res.Message = user.Message;
        if(user.Status !== 1001) return res;
        const jwtSecret = CONSTANTS.JWTSECRET;
        const token = await generateJWT(
            { 
                Email: user.Data.Email,
                date: new Date()
            },
            jwtSecret,
            3600 * 24 * 365
        );
        res.Data = {
            ...user.Data,
            Token: token
        }
        return res;
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

