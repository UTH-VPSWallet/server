import { Hono } from 'hono';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerService } from '../services/customer.service';

export const CustomerController = new Hono<{ Bindings: { DB: D1Database } }>();

CustomerController.get('/get-all', async (c) => {
    const repo = new CustomerRepository(c.env.DB);
    const service = new CustomerService(repo);
    return c.json(await service.GetAll());
});