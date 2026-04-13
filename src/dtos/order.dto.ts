export interface GetOrdersBySupplierReq {
  Email: string;
}

export interface OrderSupplierRes {
  ID: number;
  CustomerName: string;
  VPSName: string;
  PricePerMonth: number;
  CreatedAt: string;
  Status: number;
}

export interface OrderCreateReq {
  CustomerEmail: string;
  VPSID: number;
}

export interface OrderUpdateStatusReq {
  ID: number;
  Status: number;
}