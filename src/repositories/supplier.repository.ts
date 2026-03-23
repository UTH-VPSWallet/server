import { drizzle } from 'drizzle-orm/d1';
import { eq, and, InferSelectModel } from 'drizzle-orm';
import { SupplierEntity } from '../entities/suppier.entity';
import { SupplierLoginReq } from '../dtos/supplier.dto';

export type SupplierModel = InferSelectModel<typeof SupplierEntity>;

export class SupplierRepository {
  constructor(private db: D1Database) {}

  async SupplierLogin(supplierLoginReq: SupplierLoginReq): Promise<SupplierModel | undefined>{
    const orm = drizzle(this.db);
    console.log("supplierLoginReq", supplierLoginReq)
    return await orm.select().from(SupplierEntity).where(and(
      eq(SupplierEntity.Email, supplierLoginReq.Email),
      eq(SupplierEntity.Pass, supplierLoginReq.Pass))).get();
  }
}