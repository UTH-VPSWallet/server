import { VPSRepository } from '../repositories/vps.repository';
import { GetBySupplierRes, GetBySupplierReq, VPSAddReq, VPSUpdateReq, VPSDeleteReq, VPSGetByStatusRes, VPSGetByIDReq, VPSGetByIDRes } from '../dtos/vps.dto';
import { Res, ResData } from '../dtos/res.dto';

export class VPSService {

    constructor(private repo: VPSRepository) {}

    async GetBySupplier(req: GetBySupplierReq): Promise<ResData<GetBySupplierRes[]>> { return await this.repo.SelectByEmail(req) }

    async GetByStatus(): Promise<ResData<VPSGetByStatusRes[]>> { return await this.repo.SelectByStatus() }

    async GetByID(req: VPSGetByIDReq): Promise<ResData<VPSGetByIDRes>> { return await this.repo.SelectByID(req) }

    async Add(req: VPSAddReq): Promise<Res> { return await this.repo.Create(req) }

    async Edit(req: VPSUpdateReq): Promise<Res> { return await this.repo.Update(req) }

    async Remove(req: VPSDeleteReq): Promise<Res> { return await this.repo.Delete(req) }
}