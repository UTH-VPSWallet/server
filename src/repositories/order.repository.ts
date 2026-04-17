import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { OrderEntity } from '../entities/order.entity';
import { VPSEntity } from '../entities/vps.entity';
import { CustomerEntity } from '../entities/customer.entity';
import { GetOrdersBySupplierReq, OrderSupplierRes, OrderCreateReq, OrderUpdateStatusReq, GetOrdersByIDRes, GetOrdersByIDReq, GetOrdersByCustomerEmailReq, GetOrdersByCustomerEmailRes } from '../dtos/order.dto';
import { ERRORS, SUCCESS, VPS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes, OrderStatus } from '../constants/enum.constant';
import { SupplierEntity } from '../entities/suppier.entity';

export class OrderRepository {
    constructor(private db: D1Database) {}

    async SelectBySupplier(req: GetOrdersBySupplierReq): Promise<ResData<OrderSupplierRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: OrderEntity.ID,
                CustomerName: CustomerEntity.Name,
                VPSName: VPSEntity.Name,
                PricePerMonth: VPSEntity.PricePerMonth,
                CreatedAt: OrderEntity.CreatedAt,
                Status: OrderEntity.Status
            })
            .from(OrderEntity)
            .innerJoin(VPSEntity, eq(OrderEntity.VPSID, VPSEntity.ID))
            .innerJoin(CustomerEntity, eq(OrderEntity.CustomerEmail, CustomerEntity.Email))
            .where(eq(VPSEntity.Email, req.Email));

            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] };
        }
    }

    async SelectByID(req: GetOrdersByIDReq): Promise<ResData<GetOrdersByIDRes>> {
        const orm = drizzle(this.db);
        try {
            const [results] = await orm.select({
                CreatedAt: OrderEntity.CreatedAt,
                UpdatedAt: OrderEntity.UpdatedAt,
                Status: OrderEntity.Status,
                TotalMonth: OrderEntity.TotalMonth,
                TotalPrice: OrderEntity.TotalPrice,
                VPS:{
                    VPSID: OrderEntity.ID,
                    Name: VPSEntity.Name,
                    CPU: VPSEntity.CPU,
                    RAM: VPSEntity.RAM,
                    Storage: VPSEntity.Storage,
                    PricePerMonth: VPSEntity.PricePerMonth,
                },
                Supplier: {
                    Email: VPSEntity.Email,
                    Name: SupplierEntity.Name,
                },
            })
            .from(OrderEntity).where(eq(OrderEntity.ID, req.ID))
            .innerJoin(VPSEntity, eq(OrderEntity.VPSID, VPSEntity.ID))
            .innerJoin(SupplierEntity, eq(VPSEntity.Email, SupplierEntity.Email)).limit(1);
            if(results) return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
            return { Status : httpCodes.ServiceUnavailable, Message: ERRORS.CREATE }; 
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }

    async SelectByCustomerEmail(req: GetOrdersByCustomerEmailReq): Promise<ResData<GetOrdersByCustomerEmailRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: OrderEntity.ID,
                CreatedAt: OrderEntity.CreatedAt,
                UpdatedAt: OrderEntity.UpdatedAt,
                Status: OrderEntity.Status,
                TotalMonth: OrderEntity.TotalMonth,
                TotalPrice: OrderEntity.TotalPrice,
                VPS:{
                    VPSID: OrderEntity.ID,
                    Name: VPSEntity.Name,
                    CPU: VPSEntity.CPU,
                    RAM: VPSEntity.RAM,
                    Storage: VPSEntity.Storage,
                    PricePerMonth: VPSEntity.PricePerMonth,
                },
                Supplier: {
                    Email: VPSEntity.Email,
                    Name: SupplierEntity.Name,
                },
            })
            .from(OrderEntity).where(eq(OrderEntity.CustomerEmail, req.Email))
            .innerJoin(VPSEntity, eq(OrderEntity.VPSID, VPSEntity.ID))
            .innerJoin(SupplierEntity, eq(VPSEntity.Email, SupplierEntity.Email)).limit(1);
            if(results) return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
            return { Status : httpCodes.ServiceUnavailable, Message: ERRORS.CREATE }; 
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }

    async Create(req: OrderCreateReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            const result = await orm.insert(OrderEntity).values({
                ID: Date.now(),
                CustomerEmail: req.CustomerEmail,
                VPSID: req.VPSID,
                Status: OrderStatus.Create,
                CreatedAt: Date.now(),
                UpdatedAt: Date.now(),
                TotalMonth: req.TotalMonth,
                TotalPrice: req.TotalPrice,
            }).returning({ ID: OrderEntity.ID });
            if(result) return { Status : httpCodes.OK, Message: SUCCESS.CREATE };
            return { Status : httpCodes.ServiceUnavailable, Message: ERRORS.CREATE }; 
        } catch{ return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR }}
    }

    async UpdateStatus(req: OrderUpdateStatusReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            const [existing] = await orm.select().from(OrderEntity).where(eq(OrderEntity.ID, req.ID)).limit(1);
            if (!existing) return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
            const update = await orm.update(OrderEntity).set({
                Status: req.Status,
                UpdatedAt: Date.now()
            }).where(eq(OrderEntity.ID, req.ID));
            if (update) return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
            return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
        } catch { return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR } }
    }
}