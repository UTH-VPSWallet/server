import { CommentRepository } from '../repositories/comment.repository';
import { CommentGetByVPSReq, CommentAddReq, CommentRes } from '../dtos/comment.dto';
import { Res, ResData } from '../dtos/res.dto';

export class CommentService {
    constructor(private repo: CommentRepository) {}

    async GetComments(req: CommentGetByVPSReq): Promise<ResData<CommentRes[]>>{ return await this.repo.GetByVPSID(req); }
    
    async Add(req: CommentAddReq): Promise<Res> { return await this.repo.Create(req); }
}