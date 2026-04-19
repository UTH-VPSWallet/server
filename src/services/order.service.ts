import { OrderRepository } from '../repositories/order.repository';
import { GetOrdersBySupplierReq, OrderSupplierRes, OrderCreateReq, OrderCreateRes, OrderUpdateStatusReq, GetOrdersByIDReq, GetOrdersByIDRes, GetOrdersByCustomerEmailReq, GetOrdersByCustomerEmailRes, OrderCancelReq } from '../dtos/order.dto';
import { Res, ResData } from '../dtos/res.dto';

export class OrderService {

    constructor(private repo: OrderRepository) {}

    async Add(req: OrderCreateReq): Promise<ResData<OrderCreateRes>> { return await this.repo.Create(req) }

    async GetByID(req: GetOrdersByIDReq): Promise<ResData<GetOrdersByIDRes>> { return await this.repo.SelectByID(req) }

    async GetByCustomerEmail(req: GetOrdersByCustomerEmailReq): Promise<ResData<GetOrdersByCustomerEmailRes[]>>
    { return await this.repo.SelectByCustomerEmail(req) }

    async UpdateStatus(req: OrderUpdateStatusReq): Promise<Res> { return await this.repo.UpdateStatus(req)}

    async GetBySupplier(req: GetOrdersBySupplierReq): Promise<ResData<OrderSupplierRes[]>> { return await this.repo.SelectBySupplier(req) }
    
    async Cancel(req: OrderCancelReq): Promise<Res> { return await this.repo.CancelOrder(req); }
}