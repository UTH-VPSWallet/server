import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerAddReq, CustomerEditPassReq, CustomerLoginReq, CustomerLoginRes, CustomerRes, ForgotPassReq, SelectUserByEmailPhoneReq, SelectUserByEmailPhoneRes, UpdateUserPassReq } from '../dtos/customer.dto';
import { Res, ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';
import { CONSTANTS } from '../constants/text.constant';
import { generateJWT } from '../utils/jwt.util';
import { GeneralService } from './general.service';
import { randomDigitsString } from '../utils/util';
import { EmailSendReq } from '../dtos/general.dto';

export class CustomerService {

    constructor(
        private repo: CustomerRepository,
        private generalSer: GeneralService
    ) {}

    async Login(req: CustomerLoginReq): Promise<ResData<CustomerLoginRes>> {
        const customer = await this.repo.SelectByEmailPass(req);
        if(customer.Status !== httpCodes.OK) return {Status: customer.Status, Message: customer.Message, Data: { Name: '', Token: '' }};
        const jwtSecret = CONSTANTS.JWTSECRET;
        const token = await generateJWT(
            { 
                Email: customer.Data!.Email,
                date: new Date()
            },
            jwtSecret,
            3600 * 24 * 365
        );
        return {Status: customer.Status, Message: customer.Message, Data: { Name: customer.Data!.Name, Token: token }};
    }
    async ChangePass(req: CustomerEditPassReq): Promise<Res> { return await this.repo.UpdatePass(req) }

    async ForgotPass(req: ForgotPassReq): Promise<Res>{
        const selectUserByEmailPhoneReq: SelectUserByEmailPhoneReq = {
            Email: req.Email,
            Phone: req.Phone
        }
        const user = await this.repo.SelectCustomerByEmailPhone(selectUserByEmailPhoneReq) as ResData<SelectUserByEmailPhoneRes>;
        if(user.Status != httpCodes.OK) return user;
        const quota: Res = await this.generalSer.CheckQuota();
        if(quota.Status == 1005){
            const updateUserPassReq: UpdateUserPassReq = {
                Email: req.Email,
                Pass: randomDigitsString(6)
            }
            const emailSendReq: EmailSendReq = {
                To: user.Data!.Email,
                Subject: "UTH VPS WALLET - LẤY LẠI MẬT KHẨU",
                Body: `
                <h1 style="
                    font-family: cursive;
                    text-shadow: 2px 2px 2px #909090;
                    color: #09801c;
                    text-align: center;">VPS WALLET
                </h1>
                <p>Xin chào <b>${user.Data!.Name}</b>,</p>
                <p>Mật khẩu mới của bạn là: ${updateUserPassReq.Pass}</p>
                <p>Hãy dùng nó cho việc Đăng Nhập và sử dụng các chức năng mở rộng của VPS Wallet.</p>
                <p>Hãy đổi mật khẩu sau khi đã Đăng Nhập thành công và ghi nhớ Mật Khẩu của mình.</p>
                <p>^_^</p>
                `
            }
            const sendEmail: Res = await this.generalSer.EmailSend(emailSendReq);
            if(sendEmail.Status == 1006) return await this.repo.UpdateUserPass(updateUserPassReq);
            return sendEmail;
        }
        return quota;
    }

    async Add(req: CustomerAddReq): Promise<Res> { return await this.repo.Create(req) }

    async GetAll(): Promise<ResData<CustomerRes[]>> {
        return await this.repo.GetAll();
    }
}