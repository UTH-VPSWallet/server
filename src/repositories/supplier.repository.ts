import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { SupplierEntity } from '../entities/suppier.entity';
import { CreateReq, GetAllRes, SelectUserEmailPassRes, SupplierLoginReq, SupplierRes, UpdateReq } from '../dtos/supplier.dto';
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
      const [user] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.email)).limit(1);
      if(!user){
        res.Status = 5001;
        res.Message = SUPPLIER.RES_5001;
        return res;
      }
      const checkPass = await bcrypt.compare(req.pass, user.Pass);
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
  async GetAll(): Promise<ResData<GetAllRes[]>> {
        const orm = drizzle(this.db);
        let res = new ResData<GetAllRes[]>();
        try {
            const suppliers = await orm.select().from(SupplierEntity);
            const resData: GetAllRes[] = suppliers.map(x => ({
              Name: x.Name,
              Email: x.Email,
              Location :x.Location,
              Status: x.Status
            }))
            if (!suppliers) {
                res.Status = 2001;
                res.Message = ERRORS.ERROR_2001;
                return res;
            }

            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
            res.Data = resData;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }

    async Create(req: CreateReq): Promise<Res> {
      const orm = drizzle(this.db);
      try {
        const result = await orm.insert(SupplierEntity).values({
          Name: req.Name,
          Email: req.Email,
          Pass : "$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m",
          Location: req.Location,
          Status : 1
        }).returning({ insertedId: SupplierEntity.Email });

        return {
        Status : 200,
        Message: "Tạo thành công"
        };
      } catch {
        return {
        Status : 500,
        Message: "Tạo thất bại"
        };
    }}

  async Update(req: UpdateReq): Promise<Res>
  {
      const orm = drizzle(this.db);
      let res = new Res();
    try {

        const [existing] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.Email)).limit(1);
        if (!existing) {
            res.Status = 5001;
            res.Message = SUPPLIER.RES_5001;
            return res;
        }

        await orm.update(SupplierEntity).set({
            Name: req.Name ?? existing.Name,
            Location : req.Location ?? existing.Location,
            Status: req.Status ?? existing.Status
        }).where(eq(SupplierEntity.Email, req.Email));

        res.Status = 1003;
        res.Message = SUCCESS.SUCCESS_1003;
        return res;
    } catch {
        res.Status = 3000;
        res.Message = ERRORS.ERROR_3000;
        return res;
    }
  }

  async GetByEmail(req : string): Promise<ResData<SupplierRes>> {
    const orm = drizzle(this.db);
    let res = new ResData<SupplierRes>();
    try {
      const [existing] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req)).limit(1);
      
      if (!existing) {
          res.Status = 5001;
          res.Message = SUPPLIER.RES_5001;
          return res;
      }

      const resData: SupplierRes = {
        Email: existing.Email,
        Name: existing.Name,
        Location : existing.Location,
        Status : existing.Status
      }
      
      res.Status = 1003;
      res.Message = SUCCESS.SUCCESS_1001;
      res.Data = resData;
      return res;
    } 
    catch {
      res.Status = 3000;
      res.Message = ERRORS.ERROR_3000;
      return res;
    }
  }
}