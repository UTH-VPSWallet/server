import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerRes } from '../dtos/customer.dto';
import { ResData } from '../dtos/res.dto';

export class CustomerService {
    constructor(private repo: CustomerRepository) {}

    async GetAll(): Promise<ResData<CustomerRes[]>> {
        return await this.repo.GetAll();
    }
}