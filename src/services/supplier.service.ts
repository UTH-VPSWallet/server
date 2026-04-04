import { SupplierRepository } from '../repositories/supplier.repository';
import { GetAllRes, SelectUserByEmailPassReq, SelectUserEmailPassRes, SupplierLoginReq, SupplierLoginRes} from '../dtos/supplier.dto';
import { ResData } from '../dtos/res.dto';
import { generateJWT } from '../utils/jwt.util';
import { CONSTANTS } from '../constants/text.constant';


export class  SupplierService {
  
  constructor(
    private repo: SupplierRepository,
    private jwtSecret: string,
  ) {}

    async SupplierLogin(req: SupplierLoginReq): Promise<ResData<SupplierLoginRes>> {
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

    async SupplierGetAlls(): Promise<ResData<GetAllRes[]>> {
        return await this.repo.GetAll();
    }
}