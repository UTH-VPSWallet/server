export interface GetByVPSIDRes {
    ID: number;
    Name: string;
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
export interface VPSAddReq {
    ID: number;
    Name: string;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Status: number;
    Email: string;
}