export interface GetOrdersBySupplierReq { Email: string }

export interface GetOrdersByIDReq { ID: number }

export interface OrderDetailRes {
  ID: number;
  VPSID: number;
  Name: string;
  CPU: string;
  RAM: string;
  Storage: string;
  PricePerMonth: number;
  TotalMonth: number;
  PriceAtPurchase: number;
}

export interface GetOrdersByIDRes {
  ID: number;
  CreatedAt: number;
  UpdatedAt: number;
  Status: number;
  TotalPrice: number;
  VPS: OrderDetailRes[];
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
  TotalPrice: number;
}

export interface OrderSupplierRes {
  ID: number;
  CustomerName: string;
  TotalPrice: number;
  CreatedAt: number;
  Status: number;
  VPS: OrderDetailRes[];
}

export interface OrderCreateReq {
  CustomerEmail: string;
  VPS: {
    VPSID: number;
    TotalMonth: number;
    TotalPrice: number;
  }[];
}

export interface OrderCreateRes {
  ID: number;
}

export interface OrderUpdateStatusReq {
  ID: number;
  Status: number;
}