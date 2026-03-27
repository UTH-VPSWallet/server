import { Hono } from 'hono';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AddBySupplierReq, EditBySupplierReq } from '../dtos/category.dto';
import { Res } from '../dtos/res.dto'
import { ERRORS, CATEGORY } from '../constants/text.constant'

export const CategoryController = new Hono<{ Bindings: { DB: D1Database } }>();

CategoryController.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    let res = new Res();
    
    if (isNaN(id)) {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    const repo = new CategoryRepository(c.env.DB);
    const service = new CategoryService(repo);
    const result = await service.GetByCategoryID(id);
  
    return c.json(result);
});

CategoryController.get('/supplier/get-categories', AuthMiddleware, async (c) => {
    const user = c.get('user');
    const supplierEmail = user.Email;

    const repo = new CategoryRepository(c.env.DB);
    const service = new CategoryService(repo);
    const result = await service.GetBySupplier(supplierEmail);
  
    return c.json(result);
});

CategoryController.post('/supplier/add-category', AuthMiddleware, async (c) => {
    const user = c.get('user');
    const supplierEmail = user.Email;

    let req = null;
    let res = new Res();

    try {
        req = await c.req.json<AddBySupplierReq>();
    } catch {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    if (!req.Name) {
        res.Status = 6003;
        res.Message = CATEGORY.RES_6003;
        return c.json(res);
    }

    const repo = new CategoryRepository(c.env.DB);
    const service = new CategoryService(repo);
    const result = await service.AddBySupplier(supplierEmail, req);
  
    return c.json(result);
});

CategoryController.put('/supplier/edit-category', AuthMiddleware, async (c) => {
    const user = c.get('user');
    const supplierEmail = user.Email;

    let req = null;
    let res = new Res();

    try {
        req = await c.req.json<EditBySupplierReq>();
    } catch {
        res.Status = 4000;
        res.Message = ERRORS.ERROR_4000;
        return c.json(res);
    }

    if (!req.ID) {
        res.Status = 6004;
        res.Message = CATEGORY.RES_6004;
        return c.json(res);
    }

    const repo = new CategoryRepository(c.env.DB);
    const service = new CategoryService(repo);
    const result = await service.EditBySupplier(supplierEmail, req);
  
    return c.json(result);
});
