import { VPSRepository } from '../repositories/vps.repository';
import { GetByVPSIDRes, GetBySupplierRes } from '../dtos/vps.dto';
import { ResData } from '../dtos/res.dto';

export class VPSService {
    constructor(private repo: VPSRepository) {}

    async GetByVPSID(id: number): Promise<ResData<GetByVPSIDRes>> {
        return await this.repo.GetByVPSID(id);
    }
    
    async GetBySupplier(supplierEmail: string): Promise<ResData<GetBySupplierRes[]>> {
        return await this.repo.GetBySupplier(supplierEmail);
    }
}