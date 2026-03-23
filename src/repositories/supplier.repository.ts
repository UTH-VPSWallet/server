import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { SupplierEntity } from '../entities/suppier.entity';
import { SelectUserEmailPassRes, SupplierLoginReq } from '../dtos/supplier.dto';
import { ERRORS, SUCCESS, SUPPLIER } from '../constants/text.constant';
import bcrypt from 'bcryptjs';
import { Res, ResData } from '../dtos/res.dto';

export type SupplierModel = InferSelectModel<typeof SupplierEntity>;

export class SupplierRepository {
  constructor(private db: D1Database) {}

  async SelectSupplierByEmailPass(req: SupplierLoginReq): Promise<Res>{
    const orm = drizzle(this.db);
    let res = new ResData<SelectUserEmailPassRes>();
    try{
      const [user] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.Email)).limit(1);
      if(!user){
        res.Status = 5001;
        res.Message = SUPPLIER.RES_5001;
        return res;
      }
      const checkPass = await bcrypt.compare(req.Pass, user.Pass);
      if(!checkPass){
        res.Status = 5002;
        res.Message = SUPPLIER.RES_5002;
        return res;
      }
      if(user.Status === 5003){
        res.Status = 5003;
        res.Message = SUPPLIER.RES_5003;
        return res;
      }
      if(user.Status === 5004){
        res.Status = 5004;
        res.Message = SUPPLIER.RES_5004;
        return res;
      }
      if(user.Status === 1001){
        res.Status = 1001;
        res.Message = SUCCESS.SUCCESS_1001;
        res.Data = {
          Email: user.Email,
          Name: user.Name
        }
        return res;
      }
      res.Status = 2001;
      res.Message = ERRORS.ERROR_2001;
      return res;
    }
    catch { 
      res.Status = 3000;
      res.Message = ERRORS.ERROR_3000;
      return res;
    }
  }
}