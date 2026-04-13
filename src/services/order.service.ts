import { OrderRepository } from '../repositories/order.repository';
import { GetOrdersBySupplierReq, OrderCreateReq, OrderUpdateStatusReq } from '../dtos/order.dto';
import { Res, ResData } from '../dtos/res.dto';

export class OrderService {
    constructor(private repo: OrderRepository) {}

    async GetBySupplier(req: GetOrdersBySupplierReq): Promise<ResData<any>> {
        return await this.repo.SelectBySupplier(req);
    }

    async Create(req: OrderCreateReq): Promise<Res> {
        return await this.repo.Create(req);
    }

    async UpdateStatus(req: OrderUpdateStatusReq): Promise<Res> {
        return await this.repo.UpdateStatus(req);
    }
}