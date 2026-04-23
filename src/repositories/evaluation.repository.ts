import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { EvaluationEntity } from '../entities/evaluation.entity';
import { OrderEntity } from '../entities/order.entity';
import { OrderDetailEntity } from '../entities/orderDetail.entity';
import { EvaluationAddReq } from '../dtos/evaluation.dto';
import { ERRORS, EVALUATION, SUCCESS } from '../constants/text.constant';
import { Res } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';

export class EvaluationRepository {
    constructor(private db: D1Database) {}

    async Create(req: EvaluationAddReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            // Kiểm tra xem có đơn hàng nào của Email này, cho VPSID này và Status = 1 không
            const [activeOrder] = await orm.select({ id: OrderEntity.ID })
                .from(OrderEntity)
                .innerJoin(OrderDetailEntity, eq(OrderEntity.ID, OrderDetailEntity.OrderID))
                .where(
                    and(
                        eq(OrderEntity.CustomerEmail, req.Email),
                        eq(OrderEntity.Status, 1),
                        eq(OrderDetailEntity.VPSID, req.VPSID)
                    )
                )
                .limit(1);

            if (!activeOrder) return { Status: httpCodes.Forbidden, Message: EVALUATION.ACTIVE_ORDER_REQUIRED };

            // Sử dụng onConflictDoUpdate để nếu đã đánh giá rồi thì cập nhật lại số sao
            await orm.insert(EvaluationEntity).values({
                VPSID: req.VPSID,
                Email: req.Email,
                Rate: req.Rate,
                Status: 1
            }).onConflictDoUpdate({
                target: [EvaluationEntity.VPSID, EvaluationEntity.Email],
                set: { Rate: req.Rate }
            });

            return { Status: httpCodes.OK, Message: SUCCESS.CREATE };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }
}