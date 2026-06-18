import { ResData } from '../dtos/res.dto';
import { generateJWT } from '../utils/jwt.util';
import { CONSTANTS } from '../constants/text.constant';
import { httpCodes } from '../constants/enum.constant';
import { AdminRepository } from '../repositories/admin.repository';
import { AdminLoginReq, AdminLoginRes } from '../dtos/admin.dto';


export class AdminService {
  
  constructor(
    private repo: AdminRepository
  ) {}

    async Login(req: AdminLoginReq): Promise<ResData<AdminLoginRes>> {
        const admin = await this.repo.SelectByEmailPass(req);
        if(admin.Status !== httpCodes.OK) return { Status: admin.Status, Message: admin.Message, Data: { Email: '', Token: '' } };
        const jwtSecret = CONSTANTS.JWTSECRET;
        const token = await generateJWT(
            { 
                Email: req.Email,
                date: new Date()
            },
            jwtSecret,
            3600 * 24 * 365
        );
        return {Status: admin.Status, Message: admin.Message, Data: { Email: req.Email, Token: token }};
    }
}

