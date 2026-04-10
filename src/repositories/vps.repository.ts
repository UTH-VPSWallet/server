import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { VPSEntity } from '../entities/vps.entity';
import { CategoryEntity } from '../entities/category.entity';
import { GetByVPSIDRes, GetByCategoryIDRes, GetBySupplierRes, GetBySupplierReq } from '../dtos/vps.dto';
import { ERRORS, SUCCESS } from '../constants/text.constant';
import { ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';

export type VPSModel = InferSelectModel<typeof VPSEntity>;

export class VPSRepository {
    constructor(private db: D1Database) {}

    async GetByVPSID(id: number): Promise<ResData<GetByVPSIDRes>> {
        const orm = drizzle(this.db);
        let res = new ResData<GetByVPSIDRes>();
        try {
            const [vps] = await orm.select().from(VPSEntity).where(eq(VPSEntity.ID, id)).limit(1);

            if (!vps) {
                res.Status = 2001;
                res.Message = ERRORS.GET;
                return res;
            }

            res.Status = 1001;
            res.Message = SUCCESS.GET;
            res.Data = vps;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }

    async GetByCategoryID(categoryID: number): Promise<ResData<GetByCategoryIDRes[]>> {
        const orm = drizzle(this.db);
        let res = new ResData<GetByCategoryIDRes[]>();
        try {
            const vpsList = await orm.select().from(VPSEntity).where(eq(VPSEntity.CategoryID, categoryID));
            
            res.Status = 1001;
            res.Message = SUCCESS.GET;
            res.Data = vpsList;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }
    
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
}