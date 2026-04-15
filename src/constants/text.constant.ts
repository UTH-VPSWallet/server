export const CONSTANTS = {
    JWTSECRET: 'UTH_VPSWALLET_DEV_SECRET',
    BASE_URL: 'https://vpswallet.vn/',
    CLIENT_URL: 'http://localhost:1001',
    ADMIN_URL: 'http://localhost:1002',
    GENERAL_SERVER_URL: 'https://general.nguyenhohoangvy.workers.dev/',
    GENERAL_LOCAL_URL: 'http://127.0.0.1:8787/',
}
export const SUCCESS = {
    SUCCESS_1000: 'Hiển thị/Thêm/Sửa/Xóa thành công',
    GET: 'Get data success',
    CREATE: 'Create data success',
    UPDATE: 'Update data success',
    DELETE: 'Delete data success'
}
export const ERRORS = {
    BADREQUEST: 'Bad request',
    NOTFOUND: 'Not Found',
    INTERNALSERVERERROR: 'Internal Server Error',
    ERROR_2000: 'Hiển thị/Thêm/Sửa/Xóa thất bại',
    GET: 'Get data failed',
    CREATE: 'Create data failed',
    UPDATE: 'Update data failed',
    DELETE: 'Delete data failed',
    ERROR_3000: 'Lỗi kết nối DataBase',
    ERROR_3002: 'Lỗi không xác định',
    ERROR_3003: 'Lỗi kết nối đến google script send email',
    ERROR_3004: 'Lỗi kết nối đến R2',
    ERROR_4000: 'Đầu vào không hợp lệ' 
}
export const SUPPLIER = {
    EMAIL_REQUIRED: 'Email required',
    PWD_REQUIRED: 'Password required',
    NEW_PWD_REQUIRED: 'New Password required',
    PHONE_REQUIRED: 'Phone required',
    EMAIL_NOT_EXIST: 'Email not exist',
    EMAIL_PHONE_NOT_MATCH: 'Email or Phone not match',
    PASS_WRONG: 'Password wrong',
    LOCKED: 'Account locked',
    NOT_ACTIVE: 'Account not active',
}
export const VPS = {
    RES_7001: 'VPS không tồn tại',
    ID_REQUIRED: 'ID required',
    EMAIL_REQUIRED: 'Email required',
    NAME_REQUIRED: 'Name required',
    CPU_REQUIRED: 'CPU required',
    RAM_REQUIRED: 'RAM required',
    STRORAGE_REQUIRED: 'Storage required',
    PRICEMONTH_REQUIRED: 'Price Month required',
    STATUS_REQUIRED: 'Status required',
}
export const Order = {
    SUPPLIER_EMAIL_REQUIRED: 'Supplier Email required',
    CUSTOMER_EMAIL_REQUIRED: 'Customer Email required',
    VPSID_REQUIRED: 'VPSID required',
    ORDER_ID_REQUIRED: 'Order ID required',
}