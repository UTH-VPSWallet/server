export interface AdminLoginReq {
    Email: string;
    Pass: string;
}

export interface AdminLoginRes {
    Token: string;
    Email: string;
}
export interface SelectAdminEmailPassRes { 
    Email: string
}