export interface GetByCategoryIDRes {
    ID: number;
    Name: string;
    SupplierEmail: string;
    Status: number;
}

export interface GetBySupplierRes {
    ID: number;
    Name: string;
    SupplierEmail: string;
    Status: number;
}[]

export interface AddBySupplierReq {
    Name: string;
}

export interface AddBySupplierRes {
    ID: number;
}

export interface EditBySupplierReq {
    ID: number;
    Name?: string;
    Status?: number;
}