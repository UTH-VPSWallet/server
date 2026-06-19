import { drizzle } from 'drizzle-orm/d1';
import { and, eq, InferSelectModel, sql } from 'drizzle-orm';
import { VPSEntity } from '../entities/vps.entity';;
import { GetBySupplierRes, GetBySupplierReq, VPSAddReq, VPSUpdateReq, VPSDeleteReq, VPSGetByStatusRes, VPSGetByIDRes, VPSGetByIDReq, VPSSelectByCategoryReq, VPSGetAllRes } from '../dtos/vps.dto';
import { ERRORS, SUCCESS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes, VPSStatus } from '../constants/enum.constant';
import { SupplierEntity } from '../entities/suppier.entity';
import { EvaluationEntity } from '../entities/evaluation.entity';

export type VPSModel = InferSelectModel<typeof VPSEntity>;

export class VPSRepository {

    constructor(private db: D1Database) {}

    async SelectByEmail(req: GetBySupplierReq): Promise<ResData<GetBySupplierRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: VPSEntity.ID,
                Name: VPSEntity.Name,
                PricePerMonth: VPSEntity.PricePerMonth,
                Storage: VPSEntity.Storage,
                RAM: VPSEntity.RAM,
                CPU: VPSEntity.CPU,
                Category: VPSEntity.Category,
                Status: VPSEntity.Status
            }).from(VPSEntity).where(eq(VPSEntity.Email, req.Email));
            return {
                Status: httpCodes.OK,
                Message: SUCCESS.GET,
                Data: results
            };
        }  catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] }}
    }

    async SelectAll(): Promise<ResData<VPSGetAllRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: VPSEntity.ID,
                Name: VPSEntity.Name,
                PricePerMonth: VPSEntity.PricePerMonth,
                Storage: VPSEntity.Storage,
                RAM: VPSEntity.RAM,
                CPU: VPSEntity.CPU,
                Category: VPSEntity.Category,
                Status: VPSEntity.Status,
                Supplier: {
                    Email: SupplierEntity.Email,
                    Name: SupplierEntity.Name,
                    Logo: SupplierEntity.Logo,
                    Phone: SupplierEntity.Phone,
                    Location: SupplierEntity.Location,
                },
                Evaluation: {
                    Rate: sql<number>`COALESCE(CAST(AVG(${EvaluationEntity.Rate}) AS FLOAT), 0)`,
                    TotalReview: sql<number>`COUNT(${EvaluationEntity.Rate})`
                }
            })
            .from(VPSEntity)
            .innerJoin(SupplierEntity,eq(VPSEntity.Email, SupplierEntity.Email))
            .leftJoin(EvaluationEntity, eq(VPSEntity.ID, EvaluationEntity.VPSID))
            .where(eq(VPSEntity.Status, VPSStatus.Enable))
            .groupBy(VPSEntity.ID, SupplierEntity.Email);
            return {
                Status: httpCodes.OK,
                Message: SUCCESS.GET,
                Data: results
            };
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] }}
    }

    async SelectByStatus(): Promise<ResData<VPSGetByStatusRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: VPSEntity.ID,
                Name: VPSEntity.Name,
                PricePerMonth: VPSEntity.PricePerMonth,
                Storage: VPSEntity.Storage,
                RAM: VPSEntity.RAM,
                CPU: VPSEntity.CPU,
                Category: VPSEntity.Category,
                Supplier: {
                    Email: SupplierEntity.Email,
                    Name: SupplierEntity.Name,
                    Phone: SupplierEntity.Phone,
                    Location: SupplierEntity.Location,
                },
                Evaluation: {
                    Rate: sql<number>`COALESCE(CAST(AVG(${EvaluationEntity.Rate}) AS FLOAT), 0)`,
                    TotalReview: sql<number>`COUNT(${EvaluationEntity.Rate})`
                }
            })
            .from(VPSEntity)
            .innerJoin(SupplierEntity,eq(VPSEntity.Email, SupplierEntity.Email))
            .leftJoin(EvaluationEntity, eq(VPSEntity.ID, EvaluationEntity.VPSID))
            .where(eq(VPSEntity.Status, VPSStatus.Enable))
            .groupBy(VPSEntity.ID, SupplierEntity.Email);
            return {
                Status: httpCodes.OK,
                Message: SUCCESS.GET,
                Data: results
            };
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] }}
    }

    async SelectByCategory(req: VPSSelectByCategoryReq): Promise<ResData<VPSGetByStatusRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: VPSEntity.ID,
                Name: VPSEntity.Name,
                PricePerMonth: VPSEntity.PricePerMonth,
                Storage: VPSEntity.Storage,
                RAM: VPSEntity.RAM,
                CPU: VPSEntity.CPU,
                Category: VPSEntity.Category,
                Supplier: {
                    Email: SupplierEntity.Email,
                    Name: SupplierEntity.Name,
                    Phone: SupplierEntity.Phone,
                    Location: SupplierEntity.Location,
                },
                Evaluation: {
                    Rate: sql<number>`COALESCE(CAST(AVG(${EvaluationEntity.Rate}) AS FLOAT), 0)`,
                    TotalReview: sql<number>`COUNT(${EvaluationEntity.Rate})`
                }
            })
            .from(VPSEntity)
            .innerJoin(SupplierEntity,eq(VPSEntity.Email, SupplierEntity.Email))
            .leftJoin(EvaluationEntity, eq(VPSEntity.ID, EvaluationEntity.VPSID))
            .where(and(eq(VPSEntity.Status, VPSStatus.Enable), eq(VPSEntity.Category, req.ID)))
            .groupBy(VPSEntity.ID, SupplierEntity.Email);
            return {
                Status: httpCodes.OK,
                Message: SUCCESS.GET,
                Data: results
            };
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] }}
    }

    async SelectByID(req: VPSGetByIDReq): Promise<ResData<VPSGetByIDRes>> {
        const orm = drizzle(this.db);
        try {
            const [results] = await orm.select({
                Name: VPSEntity.Name,
                PricePerMonth: VPSEntity.PricePerMonth,
                Storage: VPSEntity.Storage,
                RAM: VPSEntity.RAM,
                CPU: VPSEntity.CPU,
                Status: VPSEntity.Status,
                Category: VPSEntity.Category,
                Supplier: {
                    Email: SupplierEntity.Email,
                    Name: SupplierEntity.Name,
                    Phone: SupplierEntity.Phone,
                    Location: SupplierEntity.Location,
                },
                Evaluation: {
                    Rate: sql<number>`CAST(AVG(${EvaluationEntity.Rate}) AS FLOAT)`,
                    TotalReview: sql<number>`COUNT(${EvaluationEntity.Rate})`
                }
            })
            .from(VPSEntity)
            .innerJoin(SupplierEntity,eq(VPSEntity.Email, SupplierEntity.Email))
            .leftJoin(EvaluationEntity, eq(VPSEntity.ID, EvaluationEntity.VPSID))
            .where(eq(VPSEntity.ID, req.ID))
            .groupBy(VPSEntity.ID, SupplierEntity.Email)
            .limit(1);
            return {
                Status: httpCodes.OK,
                Message: SUCCESS.GET,
                Data: results
            };
        }  catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }
    
    async Create(req: VPSAddReq): Promise<Res> {
      const orm = drizzle(this.db);
      try {
        const result = await orm.insert(VPSEntity).values({
            ID:  Date.now(),
            Name: req.Name,
            CPU: req.CPU,
            RAM: req.RAM,
            Storage: req.Storage,
            PricePerMonth: req.PricePerMonth,
            Category: req.Category,
            Status: req.Status,
            Email: req.Email,
        }).returning({ ID: VPSEntity.ID });
        if(result) return { Status : httpCodes.OK, Message: SUCCESS.CREATE };
        else return { Status : httpCodes.ServiceUnavailable, Message: ERRORS.CREATE }; 
      } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }

    async Update(req: VPSUpdateReq): Promise<Res>
    {
        const orm = drizzle(this.db);
        try {
            const [existing] = await orm.select().from(VPSEntity).where(eq(VPSEntity.ID, req.ID)).limit(1);
            if (!existing) return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE }
            const update = await orm.update(VPSEntity).set({
                Name: req.Name ?? existing.Name,
                CPU: req.CPU ?? existing.CPU,
                RAM: req.RAM ?? existing.RAM,
                Storage: req.Storage ?? existing.Storage,
                PricePerMonth: req.PricePerMonth ?? existing.PricePerMonth,
                Category: req.Category ?? existing.Category,
                Status: req.Status ?? existing.Status
            }).where(eq(VPSEntity.ID, req.ID));
            if(update) return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
            return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }

    async Delete(req: VPSDeleteReq): Promise<Res>{
        const orm = drizzle(this.db);
        let res = new Res();
        try{
            const [vps] = await orm.select().from(VPSEntity).where(eq(VPSEntity.ID, req.ID)).limit(1);
            if(!vps) return res;
            const del = await orm.delete(VPSEntity).where(eq(VPSEntity.ID, req.ID));
            if(del) return { Status: httpCodes.OK, Message: SUCCESS.DELETE };
            else return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.DELETE };
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }
}