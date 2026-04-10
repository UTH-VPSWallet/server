import { VPSRepository } from '../repositories/vps.repository';
import { GetByVPSIDRes, GetByCategoryIDRes, GetBySupplierRes, GetBySupplierReq } from '../dtos/vps.dto';
import { ResData } from '../dtos/res.dto';

export class VPSService {
    constructor(private repo: VPSRepository) {}

    async GetByVPSID(id: number): Promise<ResData<GetByVPSIDRes>> {
        return await this.repo.GetByVPSID(id);
    }

    async GetByCategoryID(categoryID: number): Promise<ResData<GetByCategoryIDRes[]>> {
        return await this.repo.GetByCategoryID(categoryID);
    }
    
    async GetBySupplier(req: GetBySupplierReq): Promise<ResData<GetBySupplierRes[]>> {
        return await this.repo.SelectByEmail(req);
    }
}