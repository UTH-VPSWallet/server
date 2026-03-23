export interface SupplierLoginReq {
    email: string;
    pass: string;
}
export interface SupplierLoginRes {
    Token: string;
    Name: string;
}
export interface SelectUserByEmailPassReq { 
    email: string,
    pass: string
}
export interface SelectUserEmailPassRes { 
    Email: string,
    Name: string,
}