export interface SupplierLoginReq {
    Email: string;
    Pass: string;
}
export interface SupplierLoginRes {
    Token: string;
    Name: string;
}
export interface SelectUserByEmailPassReq { 
    Email: string,
    Pass: string
}
export interface SelectUserEmailPassRes { 
    Email: string,
    Name: string,
}