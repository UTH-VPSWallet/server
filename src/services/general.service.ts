import { CONSTANTS, EMAIL, ERRORS } from "../constants/text.constant";
import { EmailSendReq } from "../dtos/general.dto";
import { Res } from "../dtos/res.dto";
import { HttpService } from "./http.service";

export class GeneralService {

  http = new HttpService(CONSTANTS.GENERAL_SERVER_URL);

  async CheckQuota(): Promise<Res> {
    const endpoint = 'email/quota';
    let res = new Res();
    try {
      const checkQuota = await this.http.get<Res>(endpoint);
      if(Number(checkQuota.Message) > 1){
        res.Status = 1005;
        res.Message = EMAIL.REMAINING_QUOTA;
        return res;
      }
      res.Status = 5008;
      res.Message = EMAIL.SEND_FAIL;
      return res;
    } catch (error) {
      res.Status = 3003,
      res.Message = ERRORS.ERROR_3003
      return res;
    }
  }

  async EmailSend(emailSendReq: EmailSendReq): Promise<Res> {
    const endpoint = 'email/send';
    let res = new Res();
    try {
      const sendEmail = await this.http.post<Res>(endpoint, emailSendReq);
      if(sendEmail.Status === 1006){
        res.Status = sendEmail.Status;
        res.Message = EMAIL.SEND_SUSSCESS;
        return res;
      }
      res.Status = 5007;
      res.Message = EMAIL.REMAINING_QUOTA_LESS;
      return res;
    }
    catch (error) { 
      res.Status = 3003,
      res.Message = ERRORS.ERROR_3003
      return res;
    }
  }
}