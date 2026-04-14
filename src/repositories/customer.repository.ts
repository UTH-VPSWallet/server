import { drizzle } from 'drizzle-orm/d1';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerRes } from '../dtos/customer.dto';
import { ERRORS, SUCCESS } from '../constants/text.constant';
import { ResData } from '../dtos/res.dto';
import { httpCodes } from '../constants/enum.constant';

export class CustomerRepository {
    constructor(private db: D1Database) {}

    async GetAll(): Promise<ResData<CustomerRes[]>> {
        const orm = drizzle(this.db);
        try {
            const results = await orm.select({
                Email: CustomerEntity.Email,
                Name: CustomerEntity.Name,
                Status: CustomerEntity.Status
            }).from(CustomerEntity);

            return { Status: httpCodes.OK, Message: SUCCESS.GET, Data: results };
        } catch {
            return { Status: httpCodes.InternalServerError, Message: ERRORS.INTERNALSERVERERROR, Data: [] };
        }
    }
}