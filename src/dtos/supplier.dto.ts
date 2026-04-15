export interface SupplierLoginReq {
    Email: string;
    Pass: string;
}
export interface SupplierEditPassReq {
    Email: string;
    Pass: string;
    PassNew: string;
}
export interface SupplierLoginRes {
    Token: string;
    Name: string;
}
export interface SelectSupplierByEmailPassReq { 
    Email: string,
    Pass: string
}
export interface SelectSupplierEmailPassRes { 
    Email: string,
    Name: string,
}
export interface UpdatePassSupplierByEmailPhoneReq { 
    Email: string,
    Phone: string
}
export interface UpdatePassSupplierByEmailPhoneRes { 
    NewPass: string,
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

export interface SupplierRes {
    Email: string;
    Name: string;
    Location : string;
    Status : number;
}