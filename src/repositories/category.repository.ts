import { drizzle } from 'drizzle-orm/d1';
import { eq, InferSelectModel } from 'drizzle-orm';
import { CategoryEntity } from '../entities/category.entity';
import { GetByCategoryIDRes, GetBySupplierRes, AddBySupplierReq, AddBySupplierRes, EditBySupplierReq } from '../dtos/category.dto';
import { ERRORS, SUCCESS, CATEGORY } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';

export type CategoryModel = InferSelectModel<typeof CategoryEntity>;

export class CategoryRepository {
    constructor(private db: D1Database) {}

    async GetByCategoryID(id: number): Promise<ResData<GetByCategoryIDRes>> {
        const orm = drizzle(this.db);
        let res = new ResData<GetByCategoryIDRes>();
        try {
            const [category] = await orm.select().from(CategoryEntity).where(eq(CategoryEntity.ID, id)).limit(1);

            if (!category){
                res.Status = 2001;
                res.Message = ERRORS.ERROR_2001;
                return res;
            }

            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
            res.Data = category;
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
            const categories = await orm.select().from(CategoryEntity).where(eq(CategoryEntity.SupplierEmail, supplierEmail));
            
            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
            res.Data = categories;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }

    async AddBySupplier(supplierEmail: string, req: AddBySupplierReq): Promise<ResData<AddBySupplierRes>> {  // Trả về ID của category mới
        const orm = drizzle(this.db);
        let res = new ResData<AddBySupplierRes>();
        try {
            const result = await orm.insert(CategoryEntity).values({
                Name: req.Name,
                SupplierEmail: supplierEmail,
                Status: 1
            }).returning({ insertedId: CategoryEntity.ID });

            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
            res.Data = { ID: result[0].insertedId };
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }

    async EditBySupplier(supplierEmail: string, req: EditBySupplierReq): Promise<Res> {
        const orm = drizzle(this.db);
        let res = new Res();
        try {
            const [existing] = await orm.select().from(CategoryEntity).where(eq(CategoryEntity.ID, req.ID)).limit(1);
            if (!existing) {
                res.Status = 6001;
                res.Message = CATEGORY.RES_6001;
                return res;
            }
            if (existing.SupplierEmail !== supplierEmail) {
                res.Status = 6002;
                res.Message = CATEGORY.RES_6002;
                return res;
            }

            await orm.update(CategoryEntity).set({
                Name: req.Name ?? existing.Name,
                Status: req.Status ?? existing.Status
            }).where(eq(CategoryEntity.ID, req.ID));

            res.Status = 1001;
            res.Message = SUCCESS.SUCCESS_1001;
            return res;
        } catch {
            res.Status = 3000;
            res.Message = ERRORS.ERROR_3000;
            return res;
        }
    }
}
