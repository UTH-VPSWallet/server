import { Hono } from 'hono';
import { EvaluationService } from '../services/evaluation.service';
import { EvaluationRepository } from '../repositories/evaluation.repository';
import { EvaluationAddReq } from '../dtos/evaluation.dto';
import { ERRORS, EVALUATION } from '../constants/text.constant';
import { httpCodes } from '../constants/enum.constant';

export const EvaluationController = new Hono<{ Bindings: { DB: D1Database } }>();

EvaluationController.post('/add', async (c) => {
    let req = null;
    try { 
        req = await c.req.json<EvaluationAddReq>();
    } catch { 
        return c.json({ Status: httpCodes.BadRequest, Message: ERRORS.BADREQUEST }, httpCodes.BadRequest);
    }

    if (!req.VPSID) return c.json({ Status: httpCodes.BadRequest, Message: EVALUATION.VPSID_REQUIRED });
    if (!req.Email) return c.json({ Status: httpCodes.BadRequest, Message: EVALUATION.EMAIL_REQUIRED });
    if (!req.Rate) return c.json({ Status: httpCodes.BadRequest, Message: EVALUATION.RATE_REQUIRED });

    const repo = new EvaluationRepository(c.env.DB);
    const service = new EvaluationService(repo);
    const result = await service.Add(req);
    return c.json(result);
});