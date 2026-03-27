import { CategoryRepository } from '../repositories/category.repository';
import { GetByCategoryIDRes, GetBySupplierRes, AddBySupplierReq, AddBySupplierRes, EditBySupplierReq } from '../dtos/category.dto';
import { Res, ResData } from '../dtos/res.dto';

export class  CategoryService {
    constructor(private repo: CategoryRepository) {}

    async GetByCategoryID(id: number): Promise<ResData<GetByCategoryIDRes>> {
        return await this.repo.GetByCategoryID(id);
    }

    async GetBySupplier(supplierEmail: string): Promise<ResData<GetBySupplierRes[]>> {
        return await this.repo.GetBySupplier(supplierEmail);
    }

    async AddBySupplier(supplierEmail: string, req: AddBySupplierReq): Promise<ResData<AddBySupplierRes>> {
        return await this.repo.AddBySupplier(supplierEmail, req);
    }

    async EditBySupplier(supplierEmail: string, req: EditBySupplierReq): Promise<Res> {
        return await this.repo.EditBySupplier(supplierEmail, req);
    }
}
