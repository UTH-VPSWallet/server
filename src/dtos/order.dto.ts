export interface GetOrdersBySupplierReq { Email: string }

export interface GetOrdersByIDReq { ID: number }
export interface GetOrdersByIDRes { 
  CreatedAt: number;
  UpdatedAt: number;
  Status: number;
  TotalMonth: number;
  TotalPrice: number;
  VPS:{
    VPSID: number;
    Name: string;
    CPU: string;
    RAM: string;
    Storage: string;
    PricePerMonth: number;
  }
  Supplier: {
    Email: string;
    Name: string;
  }
}

export interface GetOrdersByCustomerEmailReq { Email: string }

export interface GetOrdersByCustomerEmailRes {
  ID: number;
  CreatedAt: number;
  UpdatedAt: number;
  Status: number;
  TotalMonth: number;
  TotalPrice: number;
  VPS:{
    VPSID: number;
    Name: string;
    CPU: string;
    RAM: string;
    Storage: string;
    PricePerMonth: number;
  }
  Supplier: {
    Email: string;
    Name: string;
  }
}

export interface OrderSupplierRes {
  ID: number;
  CustomerName: string;
  VPSName: string;
  PricePerMonth: number;
  CreatedAt: number;
  Status: number;
}

export interface OrderCreateReq {
  CustomerEmail: string;
  VPS: {
    VPSID: number;
    TotalMonth: number;
    TotalPrice: number;
  }[];
}

export interface OrderUpdateStatusReq {
  ID: number;
  Status: number;
}