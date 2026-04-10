import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { VPSEntity } from '../entities/vps.entity';;
import { GetByVPSIDRes, GetBySupplierRes, GetBySupplierReq, VPSAddReq, VPSUpdateReq, VPSDeleteReq } from '../dtos/vps.dto';
import { ERRORS, SUCCESS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';

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
                Status: VPSEntity.Status
            }).from(VPSEntity).where(eq(VPSEntity.Email, req.Email));
            return {
                Status: httpCodes.OK,
                Message: SUCCESS.GET,
                Data: results
            };
        }  catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] }}
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
                Status: req.Status ?? existing.Status
            }).where(eq(VPSEntity.ID, req.ID));
            if(update) return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
            else return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
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