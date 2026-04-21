import { Hono } from 'hono';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentService } from '../services/comment.service';
import { CommentAddReq, CommentGetByVPSReq } from '../dtos/comment.dto';
import { COMMENT, ERRORS } from '../constants/text.constant';
import { httpCodes } from '../constants/enum.constant';

export const CommentController = new Hono<{ Bindings: { DB: D1Database } }>();

CommentController.post('/get-by-vps', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<CommentGetByVPSReq>() 
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) 
    }

    const repo = new CommentRepository(c.env.DB);
    const service = new CommentService(repo);
    return c.json(await service.GetComments(req));
});

CommentController.post('/add', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<CommentAddReq>() 
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest) 
    }
    
    if (!req.VPSID) return c.json({ Status: httpCodes.BadRequest, Message: COMMENT.VPSID_REQUIRED });
    if (!req.Content) return c.json({ Status: httpCodes.BadRequest, Message: COMMENT.CONTENT_REQUIRED });

    const repo = new CommentRepository(c.env.DB);
    const service = new CommentService(repo);
    return c.json(await service.Add(req));
});