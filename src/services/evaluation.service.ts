import { EvaluationRepository } from '../repositories/evaluation.repository';
import { EvaluationAddReq } from '../dtos/evaluation.dto';
import { Res } from '../dtos/res.dto';

export class EvaluationService {
    constructor(private repo: EvaluationRepository) {}

    async Add(req: EvaluationAddReq): Promise<Res> { return await this.repo.Create(req); }
}