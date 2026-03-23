import { SupplierRepository } from '../repositories/supplier.repository';
import { SupplierLoginReq, SupplierLoginRes} from '../dtos/supplier.dto';
import { ResData } from '../dtos/res.dto';
import { generateJWT } from '../utils/jwt.util';


export class  SupplierService {
  
  constructor(
    private repo:  SupplierRepository,
    private jwtSecret: string,
  ) {}

    async SupplierLogin(supplierLoginReq: SupplierLoginReq): Promise<ResData<SupplierLoginRes>> {
        const supplier = await this.repo.SupplierLogin(supplierLoginReq);
        let res = new ResData<SupplierLoginRes>();
        if(!supplier){
            res.Status = 0;
            res.Message = 'Tài Khoản hoặc Mật Khẩu không đúng';
            return res;
        }
        if(supplier!.Status != 1){
            res.Status = -1;
            res.Message = 'Tài khoản hiện đang không hoạt động';
            return res;
        }
        const token = await generateJWT({ Email: supplier.Email, date: new Date() },
            this.jwtSecret,
            3600
        );
        res.Status = 1;
        res.Message = 'Đăng nhập thành công';
        res.Data = {
            Name: supplier.Name,
            Token: token
        }
        return res;
    }
}