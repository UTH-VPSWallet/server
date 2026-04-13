import { Hono } from "hono";
import { cors } from "hono/cors";
import { SupplierController } from './controllers/supplier.controller';
import { CategoryController } from './controllers/category.controller';
import { VPSController } from "./controllers/vps.controller";
import { OrderController } from "./controllers/order.controller";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', (c) => {return c.json({ message: 'hello' })});
app.use('*', cors({
  origin: '*', //Cho phép tất cả domain
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['*'],
  maxAge: 86400, // cache preflight 1 ngày
  credentials: false // Nếu cần cookie/token, để true
}));

app.route('/supplier', SupplierController);
app.route('/category', CategoryController);
app.route('/vps', VPSController);
app.route('/order', OrderController);

export default app;
