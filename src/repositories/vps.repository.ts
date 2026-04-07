import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { VPSEntity } from '../entities/vps.entity';
import { CategoryEntity } from '../entities/category.entity';
import { GetByVPSIDRes, GetByCategoryIDRes, GetBySupplierRes } from '../dtos/vps.dto';
import { ERRORS, SUCCESS } from '../constants/text.constant';
import { ResData } from '../dtos/res.dto';

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
                res.Message = ERRORS.ERROR_2001;
                return res;
            }

            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
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
            res.Message = SUCCESS.SUCCESS_1001;
            res.Data = vpsList;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }
    
    async GetBySupplier(supplierEmail: string): Promise<ResData<GetBySupplierRes[]>> {
        const orm = drizzle(this.db);
        let res = new ResData<GetBySupplierRes[]>();
        try {
            // Join VPS với Category để lọc theo SupplierEmail
            const results = await orm
                .select({
                    ID: VPSEntity.ID,
                    Name: VPSEntity.Name,
                    CategoryID: VPSEntity.CategoryID,
                    PricePerMonth: VPSEntity.PricePerMonth,
                    Storage: VPSEntity.Storage,
                    RAM: VPSEntity.RAM,
                    CPU: VPSEntity.CPU,
                    Status: VPSEntity.Status
                })
                .from(VPSEntity)
                .innerJoin(CategoryEntity, eq(VPSEntity.CategoryID, CategoryEntity.ID))
                .where(eq(CategoryEntity.SupplierEmail, supplierEmail));

            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
            res.Data = results;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }
}