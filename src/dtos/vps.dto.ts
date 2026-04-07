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

export interface GetBySupplierRes {
    ID: number;
    Name: string;
    CategoryID: number;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Status: number;
}

