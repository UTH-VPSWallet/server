import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { ERRORS, SUCCESS, SUPPLIER } from '../constants/text.constant';
import bcrypt from 'bcryptjs';
import { Res } from '../dtos/res.dto';
import { httpCodes, LoginStatusRes } from '../constants/enum.constant';
import { AdminLoginReq } from '../dtos/admin.dto';
import { AdminEntity } from '../entities/admin.entity';

export class AdminRepository {

  SALT_ROUNDS: number = 10;

  constructor(private db: D1Database) {}

  async SelectByEmailPass(req: AdminLoginReq): Promise<Res>{
    const orm = drizzle(this.db);
    try{
      const [admin] = await orm.select().from(AdminEntity).where(eq(AdminEntity.Email, req.Email)).limit(1);
      if(!admin) return { Status: LoginStatusRes.EmailNotExist, Message: SUPPLIER.EMAIL_NOT_EXIST }
      const checkPass = await bcrypt.compare(req.Pass, admin.Pass);
      if(!checkPass) return { Status: LoginStatusRes.PassWrong, Message: SUPPLIER.PASS_WRONG }
      return{ Status: httpCodes.OK, Message: SUCCESS.GET };
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR } }
  }
}