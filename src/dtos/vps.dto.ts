export interface GetByVPSIDRes {
    ID: number;
    Name: string;
    CategoryID: number;
    Status: number;
}

export interface GetByCategoryIDRes {
    ID: number;
    Name: string;
    CategoryID: number;
    Status: number;
}

export interface GetBySupplierReq {
    Email: string;
}
export interface GetBySupplierRes {
    ID: number;
    Name: string;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Status: number;
}

