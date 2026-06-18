import { Hono } from "hono";
import { cors } from "hono/cors";
import { SupplierController } from './controllers/supplier.controller';
import { VPSController } from "./controllers/vps.controller";
import { OrderController } from "./controllers/order.controller";
import { CustomerController } from "./controllers/customer.controller";
import { EvaluationController } from "./controllers/evaluation.controller";
import { CommentController } from "./controllers/comment.controller";
import { httpCodes } from "./constants/enum.constant";
import { ERRORS } from "./constants/text.constant";
import { AdminController } from "./controllers/admin.controller";

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

app.route('/admin', AdminController);
app.route('/supplier', SupplierController);
app.route('/vps', VPSController);
app.route('/order', OrderController);
app.route('/customer', CustomerController);
app.route('/evaluation', EvaluationController);
app.route('/comment', CommentController);
app.notFound((c) => c.json({Status: httpCodes.NotFound, Message: ERRORS.NOTFOUND }, httpCodes.NotFound));
export default app;
