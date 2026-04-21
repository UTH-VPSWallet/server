export interface CommentGetByVPSReq {
    VPSID: number;
}

export interface CommentAddReq {
    VPSID: number;
    Content: string;
}

export interface CommentRes {
    ID: number;
    VPSID: number;
    Content: string;
    Status: number;
}