export interface GetByVPSIDRes {
    ID: number;
    Name: string;
    Status: number;
}

export interface GetBySupplierReq { Email: string }
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
    Name: string;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Status: number;
    Email: string;
}
export interface VPSUpdateReq {
    ID: number;
    Name: string;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Status: number;
}
export interface VPSDeleteReq { ID: number }
export interface VPSGetByStatusRes {
    ID: number;
    Name: string;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Supplier: {
        Email: string;
        Name: string;
        Phone: string;
        Location: string;
    }
    Evaluation: {
        Rate: number;
        TotalReview: number;
    }
}
export interface VPSGetByIDReq { ID: number }
export interface VPSGetByIDRes {
    Name: string;
    CPU :string;
    RAM :string;
    Storage :string;
    PricePerMonth: number;
    Status: number;
    Supplier: {
        Email: string;
        Name: string;
        Phone: string;
        Location: string;
    }
    Evaluation: {
        Rate: number;
        TotalReview: number;
    }
}