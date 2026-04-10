import { VPSRepository } from '../repositories/vps.repository';
import { GetByVPSIDRes, GetBySupplierRes, GetBySupplierReq, VPSAddReq } from '../dtos/vps.dto';
import { Res, ResData } from '../dtos/res.dto';

export class VPSService {
    constructor(private repo: VPSRepository) {}

    async GetByVPSID(id: number): Promise<ResData<GetByVPSIDRes>> {
        return await this.repo.GetByVPSID(id);
    }

    async GetBySupplier(req: GetBySupplierReq): Promise<ResData<GetBySupplierRes[]>> {
        return await this.repo.SelectByEmail(req);
    }

    async Create(req: VPSAddReq): Promise<Res> {
        return await this.repo.Create(req);
    }
}