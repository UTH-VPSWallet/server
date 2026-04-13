import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { SupplierEntity } from '../entities/suppier.entity';
import { CreateReq, GetAllRes, SelectUserEmailPassRes, SupplierLoginReq, SupplierRes, UpdateReq } from '../dtos/supplier.dto';
import { ERRORS, SUCCESS, SUPPLIER } from '../constants/text.constant';
import bcrypt from 'bcryptjs';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes, LoginStatusRes } from '../constants/enum.constant';

export type SupplierModel = InferSelectModel<typeof SupplierEntity>;

export class SupplierRepository {
  constructor(private db: D1Database) {}

  async SelectSupplierByEmailPass(req: SupplierLoginReq): Promise<ResData<SelectUserEmailPassRes>>{
    const orm = drizzle(this.db);
    try{
      const [user] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.Email)).limit(1);
      if(!user) return { Status: LoginStatusRes.EmailNotExist, Message: SUPPLIER.EMAIL_NOT_EXIST, Data: { Name: '' , Email: '' } }
      const checkPass = await bcrypt.compare(req.Pass, user.Pass);
      if(!checkPass) return { Status: LoginStatusRes.PassWrong, Message: SUPPLIER.PASS_WRONG, Data: { Name: '' , Email: '' } }
      if(user.Status === LoginStatusRes.Locked) return { Status: LoginStatusRes.Locked, Message: SUPPLIER.LOCKED, Data: { Name: '' , Email: '' } }
      if(user.Status === LoginStatusRes.NotActive) return { Status: LoginStatusRes.NotActive, Message: SUPPLIER.NOT_ACTIVE, Data: { Name: '' , Email: '' } }
      if(user.Status === LoginStatusRes.OK) return { Status: LoginStatusRes.OK, Message: SUCCESS.GET, Data: {
        Email: user.Email,
        Name: user.Name
      }}
      return{ Status: httpCodes.UnidentifiedError, Message: ERRORS.GET, Data: { Name: '' , Email: '' } };
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: { Name: '' , Email: '' } } }
  }
  async UpdatePass(req: any){
    const orm = drizzle(this.db);
    const [existing] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.Email)).limit(1);
    if (!existing) {
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
                res.Message = ERRORS.GET;
                return res;
            }

            res.Status = 1001;
            res.Message = SUCCESS.GET;
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
        res.Message = SUPPLIER.EMAIL_NOT_EXIST;
        return res;
      }
      await orm.update(SupplierEntity).set({
        Name: req.Name ?? existing.Name,
        Location : req.Location ?? existing.Location,
        Status: req.Status ?? existing.Status
      }).where(eq(SupplierEntity.Email, req.Email));
      res.Status = 1003;
      res.Message = SUCCESS.UPDATE;
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
          res.Message = SUPPLIER.EMAIL_NOT_EXIST;
          return res;
      }

      const resData: SupplierRes = {
        Email: existing.Email,
        Name: existing.Name,
        Location : existing.Location,
        Status : existing.Status
      }
      
      res.Status = 1003;
      res.Message = SUCCESS.GET;
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