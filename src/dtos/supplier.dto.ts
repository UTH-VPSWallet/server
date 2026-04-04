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

export interface GetAllRes {
    Email: string;
    Name: string;
    Location : string;
    Status: number;
}[]

export interface CreateReq {
    Email: string;
    Name: string;
    Location : string;
}

export interface UpdateReq {
    Email: string;
    Name: string;
    Location : string;
    Status : number;
}