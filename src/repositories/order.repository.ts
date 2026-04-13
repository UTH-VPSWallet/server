import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { OrderEntity } from '../entities/order.entity';
import { VPSEntity } from '../entities/vps.entity';
import { CustomerEntity } from '../entities/customer.entity';
import { GetOrdersBySupplierReq, OrderSupplierRes, OrderCreateReq, OrderUpdateStatusReq } from '../dtos/order.dto';
import { ERRORS, SUCCESS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';

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

    async Create(req: OrderCreateReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            const result = await orm.insert(OrderEntity).values({
                ID: Date.now(),
                CustomerEmail: req.CustomerEmail,
                VPSID: req.VPSID,
                Status: 0,
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date().toISOString()
            }).returning({ ID: OrderEntity.ID });

            if (result) {
                return { Status: httpCodes.OK, Message: SUCCESS.CREATE };
            }

            return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.CREATE };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }

    async UpdateStatus(req: OrderUpdateStatusReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            const [existing] = await orm.select().from(OrderEntity).where(eq(OrderEntity.ID, req.ID)).limit(1);
            if (!existing) {
                return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
            }

            const update = await orm.update(OrderEntity).set({
                Status: req.Status,
                UpdatedAt: new Date().toISOString()
            }).where(eq(OrderEntity.ID, req.ID));

            if (update) {
                return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
            }

            return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }
}