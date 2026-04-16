import { drizzle } from 'drizzle-orm/d1';
import { and, eq, InferSelectModel } from 'drizzle-orm';
import { SupplierEntity } from '../entities/suppier.entity';
import { CreateReq, GetAllRes, GetByStatusRes, SelectSupplierEmailPassRes, SupplierEditPassReq, SupplierLoginReq, SupplierRes, UpdatePassSupplierByEmailPhoneReq, UpdatePassSupplierByEmailPhoneRes, UpdateReq } from '../dtos/supplier.dto';
import { ERRORS, SUCCESS, SUPPLIER } from '../constants/text.constant';
import bcrypt from 'bcryptjs';
import { Res, ResData } from '../dtos/res.dto';
import { FotgotPassStatusRes, httpCodes, LoginStatusRes, SupplierStatus } from '../constants/enum.constant';

export type SupplierModel = InferSelectModel<typeof SupplierEntity>;

export class SupplierRepository {

  SALT_ROUNDS: number = 10;

  constructor(private db: D1Database) {}

  async SelectByEmailPass(req: SupplierLoginReq): Promise<ResData<SelectSupplierEmailPassRes>>{
    const orm = drizzle(this.db);
    try{
      const [supplier] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.Email)).limit(1);
      if(!supplier) return { Status: LoginStatusRes.EmailNotExist, Message: SUPPLIER.EMAIL_NOT_EXIST, Data: { Name: '' , Email: '' } }
      const checkPass = await bcrypt.compare(req.Pass, supplier.Pass);
      if(!checkPass) return { Status: LoginStatusRes.PassWrong, Message: SUPPLIER.PASS_WRONG, Data: { Name: '' , Email: '' } }
      if(supplier.Status === LoginStatusRes.Locked) return { Status: LoginStatusRes.Locked, Message: SUPPLIER.LOCKED, Data: { Name: '' , Email: '' } }
      if(supplier.Status === LoginStatusRes.NotActive) return { Status: LoginStatusRes.NotActive, Message: SUPPLIER.NOT_ACTIVE, Data: { Name: '' , Email: '' } }
      if(supplier.Status === httpCodes.OK) return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: {
        Email: supplier.Email,
        Name: supplier.Name
      }}
      return{ Status: httpCodes.UnidentifiedError, Message: ERRORS.GET, Data: { Name: '' , Email: '' } };
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: { Name: '' , Email: '' } } }
  }

  async UpdatePass(req: SupplierEditPassReq): Promise<Res> {
    const orm = drizzle(this.db);
    try{
      const [existing] = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Email, req.Email)).limit(1);
      if (!existing) return { Status: LoginStatusRes.EmailNotExist, Message: SUPPLIER.EMAIL_NOT_EXIST }
      const checkPass = await bcrypt.compare(req.Pass, existing.Pass);
      if(!checkPass) return { Status: LoginStatusRes.PassWrong, Message: SUPPLIER.PASS_WRONG }
      const hashPass = await bcrypt.hash(req.PassNew, this.SALT_ROUNDS);
      const update = await orm.update(SupplierEntity).set({ Pass: hashPass }).where(eq(SupplierEntity.Email, req.Email));
      if(update) return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
      return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR } }
  }
  
  async UpdatePassByEmailPhone(req: UpdatePassSupplierByEmailPhoneReq): Promise<ResData<UpdatePassSupplierByEmailPhoneRes>>{
    const orm = drizzle(this.db);
    try{
      const [supplier] = await orm.select().from(SupplierEntity).where(
        and(eq(SupplierEntity.Email, req.Email), eq(SupplierEntity.Phone, req.Phone))).limit(1);
      if(!supplier) return { Status: FotgotPassStatusRes.EmailPhoneNotMatch, Message: SUPPLIER.EMAIL_PHONE_NOT_MATCH, Data: { NewPass: '' } }
      if(supplier.Status === LoginStatusRes.Locked) return { Status: LoginStatusRes.Locked, Message: SUPPLIER.LOCKED, Data: { NewPass: '' } }
      if(supplier.Status === LoginStatusRes.NotActive) return { Status: LoginStatusRes.NotActive, Message: SUPPLIER.NOT_ACTIVE, Data: { NewPass: '' } }
      if(supplier.Status === httpCodes.OK){
        const newPass = this.randomString(8);
        const hashPass = await bcrypt.hash(newPass, this.SALT_ROUNDS);
        const update = await orm.update(SupplierEntity).set({ Pass: hashPass }).where(
          and(eq(SupplierEntity.Email, req.Email), eq(SupplierEntity.Phone, req.Phone)));
        if(update) return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: { NewPass: newPass } };
      }
      return{ Status: httpCodes.UnidentifiedError, Message: ERRORS.GET, Data: { NewPass: '' } };
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: { NewPass: '' } } }
  }

  async GetByStatus(): Promise<ResData<GetByStatusRes[]>> {
    const orm = drizzle(this.db);
    try {
      const results = await orm.select().from(SupplierEntity).where(eq(SupplierEntity.Status, SupplierStatus.Enable));
      return {
          Status: httpCodes.OK,
          Message: SUCCESS.GET,
          Data: results
      };
    } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] }}
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
        // const result = await orm.insert(SupplierEntity).values({
        //   Name: req.Name,
        //   Email: req.Email,
        //   Pass : "$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m",
        //   Location: req.Location,
        //   Status : 1
        // }).returning({ insertedId: SupplierEntity.Email });

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

  private randomString(length: number = 8): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      result += chars[index];
    }

    return result;
  }
}