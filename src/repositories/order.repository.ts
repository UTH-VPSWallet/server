import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { OrderEntity } from '../entities/order.entity';
import { OrderDetailEntity } from '../entities/orderDetail.entity';
import { VPSEntity } from '../entities/vps.entity';
import { CustomerEntity } from '../entities/customer.entity';
import { SupplierEntity } from '../entities/suppier.entity';
import { GetOrderBySupplierReq, GetOrderBySupplierRes, OrderCreateReq, OrderCreateRes, OrderUpdateStatusReq, GetOrdersByIDRes, GetOrdersByIDReq, GetOrdersByCustomerEmailReq, GetOrdersByCustomerEmailRes, OrderCancelReq, GetOrderAllRes } from '../dtos/order.dto';
import { ERRORS, ORDER, SUCCESS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes, OrderStatus } from '../constants/enum.constant';

export class OrderRepository {
    constructor(private db: D1Database) {}

    async SelectAll(): Promise<ResData<GetOrderAllRes[]>> {
        const orm = drizzle(this.db);
        try {
            const rows = await orm.select({
                ID: OrderEntity.ID,
                CustomerName: CustomerEntity.Name,
                CustomerEmail: CustomerEntity.Email,
                TotalPrice: OrderEntity.TotalPrice,
                CreatedAt: OrderEntity.CreatedAt,
                Status: OrderEntity.Status,
                OrderDetailID: OrderDetailEntity.ID,
                VPSID: OrderDetailEntity.VPSID,
                VPSName: VPSEntity.Name,
                CPU: VPSEntity.CPU,
                RAM: VPSEntity.RAM,
                Storage: VPSEntity.Storage,
                PricePerMonth: VPSEntity.PricePerMonth,
                TotalMonth: OrderDetailEntity.TotalMonth,
                PriceAtPurchase: OrderDetailEntity.PriceAtPurchase
            })
            .from(OrderEntity)
            .innerJoin(OrderDetailEntity, eq(OrderEntity.ID, OrderDetailEntity.OrderID))
            .innerJoin(VPSEntity, eq(OrderDetailEntity.VPSID, VPSEntity.ID))
            .innerJoin(CustomerEntity, eq(OrderEntity.CustomerEmail, CustomerEntity.Email));

            // Logic gộp dữ liệu
            const map = new Map<number, GetOrderBySupplierRes>();
            rows.forEach(row => {
                if (!map.has(row.ID)) {
                    map.set(row.ID, {
                        ID: row.ID,
                        CustomerName: row.CustomerName,
                        TotalPrice: row.TotalPrice,
                        CustomerEmail: row.CustomerEmail,
                        CreatedAt: row.CreatedAt, Status: row.Status, VPS: []
                    });
                }
                map.get(row.ID)?.VPS.push({
                    ID: row.OrderDetailID, VPSID: row.VPSID, Name: row.VPSName, CPU: row.CPU, RAM: row.RAM,
                    Storage: row.Storage, PricePerMonth: row.PricePerMonth,
                    TotalMonth: row.TotalMonth, PriceAtPurchase: row.PriceAtPurchase
                });
            });

            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: Array.from(map.values()) };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }

    async SelectBySupplier(req: GetOrderBySupplierReq): Promise<ResData<GetOrderBySupplierRes[]>> {
        const orm = drizzle(this.db);
        try {
            const rows = await orm.select({
                ID: OrderEntity.ID,
                CustomerName: CustomerEntity.Name,
                CustomerEmail: CustomerEntity.Email,
                TotalPrice: OrderEntity.TotalPrice,
                CreatedAt: OrderEntity.CreatedAt,
                Status: OrderEntity.Status,
                OrderDetailID: OrderDetailEntity.ID,
                VPSID: OrderDetailEntity.VPSID,
                VPSName: VPSEntity.Name,
                CPU: VPSEntity.CPU,
                RAM: VPSEntity.RAM,
                Storage: VPSEntity.Storage,
                PricePerMonth: VPSEntity.PricePerMonth,
                TotalMonth: OrderDetailEntity.TotalMonth,
                PriceAtPurchase: OrderDetailEntity.PriceAtPurchase
            })
            .from(OrderEntity)
            .innerJoin(OrderDetailEntity, eq(OrderEntity.ID, OrderDetailEntity.OrderID))
            .innerJoin(VPSEntity, eq(OrderDetailEntity.VPSID, VPSEntity.ID))
            .innerJoin(CustomerEntity, eq(OrderEntity.CustomerEmail, CustomerEntity.Email))
            .where(eq(VPSEntity.Email, req.Email));

            // Logic gộp dữ liệu
            const map = new Map<number, GetOrderBySupplierRes>();
            rows.forEach(row => {
                if (!map.has(row.ID)) {
                    map.set(row.ID, {
                        ID: row.ID,
                        CustomerName: row.CustomerName,
                        TotalPrice: row.TotalPrice,
                        CustomerEmail: row.CustomerEmail,
                        CreatedAt: row.CreatedAt, Status: row.Status, VPS: []
                    });
                }
                map.get(row.ID)?.VPS.push({
                    ID: row.OrderDetailID, VPSID: row.VPSID, Name: row.VPSName, CPU: row.CPU, RAM: row.RAM,
                    Storage: row.Storage, PricePerMonth: row.PricePerMonth,
                    TotalMonth: row.TotalMonth, PriceAtPurchase: row.PriceAtPurchase
                });
            });

            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: Array.from(map.values()) };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }

    async SelectByID(req: GetOrdersByIDReq): Promise<ResData<GetOrdersByIDRes>> {
        const orm = drizzle(this.db);
        try {
            const rows = await orm.select({
                OrderID: OrderEntity.ID,
                CreatedAt: OrderEntity.CreatedAt,
                UpdatedAt: OrderEntity.UpdatedAt,
                Status: OrderEntity.Status,
                TotalPrice: OrderEntity.TotalPrice,
                OrderDetailID: OrderDetailEntity.ID,
                VPSID: OrderDetailEntity.VPSID,
                VPSName: VPSEntity.Name,
                CPU: VPSEntity.CPU,
                RAM: VPSEntity.RAM,
                Storage: VPSEntity.Storage,
                PricePerMonth: VPSEntity.PricePerMonth,
                TotalMonth: OrderDetailEntity.TotalMonth,
                PriceAtPurchase: OrderDetailEntity.PriceAtPurchase,
                SupplierEmail: SupplierEntity.Email,
                SupplierName: SupplierEntity.Name
            })
            .from(OrderEntity)
            .innerJoin(OrderDetailEntity, eq(OrderEntity.ID, OrderDetailEntity.OrderID))
            .innerJoin(VPSEntity, eq(OrderDetailEntity.VPSID, VPSEntity.ID))
            .innerJoin(SupplierEntity, eq(VPSEntity.Email, SupplierEntity.Email))
            .where(eq(OrderEntity.ID, req.ID));

            if (rows.length === 0) {
                return { Status: httpCodes.NotFound, Message: ERRORS.NOTFOUND };
            }

            // Gộp dữ liệu
            const result: GetOrdersByIDRes = {
                ID: rows[0].OrderID,
                CreatedAt: rows[0].CreatedAt,
                UpdatedAt: rows[0].UpdatedAt,
                Status: rows[0].Status,
                TotalPrice: rows[0].TotalPrice,
                Supplier: { Email: rows[0].SupplierEmail, Name: rows[0].SupplierName },
                VPS: rows.map(r => ({
                    ID: r.OrderDetailID,
                    VPSID: r.VPSID,
                    Name: r.VPSName,
                    CPU: r.CPU,
                    RAM: r.RAM,
                    Storage: r.Storage,
                    PricePerMonth: r.PricePerMonth,
                    TotalMonth: r.TotalMonth,
                    PriceAtPurchase: r.PriceAtPurchase
                }))
            };

            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: result };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }

    async SelectByCustomerEmail(req: GetOrdersByCustomerEmailReq): Promise<ResData<GetOrdersByCustomerEmailRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                ID: OrderEntity.ID,
                CreatedAt: OrderEntity.CreatedAt,
                UpdatedAt: OrderEntity.UpdatedAt,
                Status: OrderEntity.Status,
                TotalPrice: OrderEntity.TotalPrice
            })
            .from(OrderEntity)
            .where(eq(OrderEntity.CustomerEmail, req.Email));

            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }

    async Create(req: OrderCreateReq): Promise<ResData<OrderCreateRes>> {
        const orm = drizzle(this.db);
        try {
            const orderId = Date.now() + Math.floor(Math.random() * 1000);
            const totalPrice = req.VPS.reduce((sum, item) => sum + item.TotalPrice, 0);

            const insertOrder = orm.insert(OrderEntity).values({
                ID: orderId,
                CustomerEmail: req.CustomerEmail,
                TotalPrice: totalPrice,
                Status: OrderStatus.Create,
                CreatedAt: Date.now(),
                UpdatedAt: Date.now(),
            });

            const insertDetails = req.VPS.map((item) => {
                return orm.insert(OrderDetailEntity).values({
                    ID: Date.now() + Math.floor(Math.random() * 10000),
                    OrderID: orderId,
                    VPSID: item.VPSID,
                    TotalMonth: item.TotalMonth,
                    PriceAtPurchase: item.TotalPrice
                });
            });

            /* Sử dụng batch để thực thi tất cả trong một lần kết nối DB
            để đảm bảo tính nguyên tử trên Cloudflare D1 */
            await orm.batch([insertOrder, ...insertDetails]);

            return { Status: httpCodes.OK, Message: SUCCESS.CREATE, Data: { ID: orderId } };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }

    async UpdateStatus(req: OrderUpdateStatusReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            const update = await orm.update(OrderEntity)
                .set({ Status: req.Status, UpdatedAt: Date.now() })
                .where(eq(OrderEntity.ID, req.ID));
            if (update) return { Status: httpCodes.OK, Message: SUCCESS.UPDATE };
            return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
        } catch { return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR } }
    }

    async CancelOrder(req: OrderCancelReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            const [existing] = await orm.select()
                .from(OrderEntity)
                .where(eq(OrderEntity.ID, req.ID))
                .limit(1);

            if (!existing) {
                return { Status: httpCodes.NotFound, Message: ERRORS.NOTFOUND };
            }

            if (existing.Status !== 0) {
                return { Status: httpCodes.BadRequest, Message: ORDER.CANCEL_ONLY_PENDING };
            }

            const result = await orm.update(OrderEntity)
                .set({ 
                    Status: 3, 
                    UpdatedAt: Date.now() 
                })
                .where(eq(OrderEntity.ID, req.ID));

            if (result) {
                return { Status: httpCodes.OK, Message: ORDER.ORDER_CANCELED };
            }
            
            return { Status: httpCodes.ServiceUnavailable, Message: ERRORS.UPDATE };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }
}