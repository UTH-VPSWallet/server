import { Hono } from 'hono'
import { SupplierLoginReq } from '../dtos/supplier.dto'
import { SupplierService } from '../services/supplier.service'
import {SupplierRepository } from '../repositories/supplier.repository'
import { Res } from '../dtos/res.dto'

export const SupplierController = new Hono<{ Bindings: { DB: D1Database, JWT_SECRET: string } }>()

SupplierController.post('/login', (c) =>
  withService(c, async (service) => {
    const body = await c.req.json<SupplierLoginReq>()
    return service.SupplierLogin(body)
  })
)

const withService = async (c: any, handler: (service: SupplierService) => Promise<Res>) => {
  try {
    const repo = new SupplierRepository(c.env.DB);
    const service = new SupplierService(repo, c.env.JWT_SECRET);
    console.log("c.env.DB", c.env.DB)
    console.log("c.env.JWT_SECRET", c.env.JWT_SECRET)
    const data = await handler(service);
    return c.json(data)
  } catch (err) {
    console.error('Lỗi SupplierController:', err);
    return c.json({ TrangThai: 500, ThongBao: 'Lỗi đầu vào!' })
  }
}
