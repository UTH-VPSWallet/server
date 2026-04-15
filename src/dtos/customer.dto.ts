export interface CustomerLoginReq {
  Email: string;
  Pass: string;
}
export interface SelectCustomerEmailPassRes { 
  Email: string,
  Name: string,
}

export interface CustomerLoginRes {
  Token: string;
  Name: string;
}

export interface CustomerRes {
  Email: string;
  Name: string;
  Status: number;
}