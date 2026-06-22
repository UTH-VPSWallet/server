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
export interface CustomerEditPassReq {
  Email: string;
  Pass: string;
  PassNew: string;
}

export interface CustomerRes {
  Email: string;
  Name: string;
  Status: number;
}

export interface CustomerAddReq {
  Email: string;
  Pass: string;
  Phone: string;
  Name: string;
}

export interface ForgotPassReq { 
  Email: string,
  Phone: string
}

export interface SelectUserByEmailPhoneReq { 
  Email: string,
  Phone: string
}
export interface SelectUserByEmailPhoneRes { 
  Email: string,
  Name: string
}

export interface UpdateUserPassReq { 
  Email: string,
  Pass: string
}

export interface UpdateUserPassReq { 
  Email: string,
  Pass: string
}