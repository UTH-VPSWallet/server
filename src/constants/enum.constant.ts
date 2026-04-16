export enum httpCodes {
    OK = 200,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500,
    ServiceUnavailable = 503,
    UnidentifiedError = 999
}

export enum AdminStatus {
    Enable = 1,

    AccountLocked = 11,
    AccountNotYetActivatied = 12,

    EmailNotExist = 101,
    PwdIncorrect = 102,
    
    EmailRequired = 1001,
    PwdRequired = 1001,
}

export enum LoginStatusRes {
    EmailNotExist = 401,
    PassWrong = 402,
    Locked = 501,
    NotActive = 502
}

export enum FotgotPassStatusRes {
   EmailPhoneNotMatch = 501,
}

export enum DepositStatus {
    Enable = 1,
    Disable = 0
}

export enum VPSStatus {
    Enable = 1,
    Disable = 0
}

export enum SupplierStatus {
    Enable = 1,
    Disable = 0
}