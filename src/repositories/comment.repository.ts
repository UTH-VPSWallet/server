import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { CommentEntity } from '../entities/comment.entity';
import { CommentAddReq, CommentGetByVPSReq, CommentRes } from '../dtos/comment.dto';
import { SUCCESS, ERRORS } from '../constants/text.constant';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';

export class CommentRepository {
    constructor(private db: D1Database) {}

    async GetByVPSID(req: CommentGetByVPSReq): Promise<ResData<CommentRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select()
                .from(CommentEntity)
                .where(eq(CommentEntity.VPSID, req.VPSID));
            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] };
        }
    }
    
    async Create(req: CommentAddReq): Promise<Res> {
        const orm = drizzle(this.db);
        try {
            await orm.insert(CommentEntity).values({
                ID: Date.now(),
                VPSID: req.VPSID,
                Content: req.Content,
                Status: 1
            });
            return { Status: httpCodes.OK, Message: SUCCESS.CREATE };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR };
        }
    }
}