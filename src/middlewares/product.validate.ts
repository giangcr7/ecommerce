import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prima';

// --- VALIDATE TẠO MỚI (CREATE) ---
export const validateCreateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, quantity, categoryId } = req.body;

        // 1. Kiểm tra trống
        if (!name || !price || !quantity) {
            req.flash('error', 'Vui lòng nhập tên, giá và số lượng!');
            return res.redirect('/admin/product/create');
        }

        // 2. Kiểm tra danh mục
        if (!categoryId) {
            req.flash('error', 'Vui lòng chọn danh mục sản phẩm!');
            return res.redirect('/admin/product/create');
        }

        // 3. Kiểm tra số âm
        if (Number(price) < 0 || Number(quantity) < 0) {
            req.flash('error', 'Giá tiền và Số lượng không được nhỏ hơn 0!');
            return res.redirect('/admin/product/create');
        }

        // 4. Kiểm tra trùng tên
        const existingProduct = await prisma.product.findFirst({
            where: { name: name.trim() }
        });

        if (existingProduct) {
            req.flash('error', 'Tên sản phẩm này đã tồn tại!');
            return res.redirect('/admin/product/create');
        }

        next();

    } catch (error) {
        console.log(error);
        req.flash('error', 'Lỗi kiểm tra dữ liệu!');
        return res.redirect('/admin/product/create');
    }
};

// --- VALIDATE CẬP NHẬT (UPDATE) ---
export const validateUpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    try {
        const { name, price, quantity, categoryId } = req.body;

        // 1. Check ID
        if (isNaN(id)) {
            req.flash('error', 'ID sản phẩm không hợp lệ!');
            return res.redirect('/admin/product'); // [SỬA LỖI] Redirect về product
        }

        // 2. Check trống
        if (!name || !price || !quantity) {
            req.flash('error', 'Vui lòng nhập tên, giá và số lượng!');
            return res.redirect(`/admin/product/edit/${id}`);
        }

        // 3. Kiểm tra trùng tên (TRỪ chính nó ra)
        // [SỬA LỖI] Bỏ check trùng price
        const existingProduct = await prisma.product.findFirst({
            where: {
                name: name.trim(), // Chỉ check trùng tên
                NOT: {
                    id: id
                }
            }
        });

        if (existingProduct) {
            req.flash('error', 'Tên sản phẩm đã bị trùng với sản phẩm khác!');
            return res.redirect(`/admin/product/edit/${id}`);
        }

        next();

    } catch (error) {
        console.log(error);
        req.flash('error', 'Lỗi kiểm tra dữ liệu!');
        return res.redirect(`/admin/product/edit/${id}`);
    }
};

// --- VALIDATE XÓA (DELETE) ---
export const validateDeleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        req.flash('error', 'ID không hợp lệ!');
        return res.redirect('/admin/product');
    }

    // [SỬA LỖI] Dùng prisma.product thay vì prisma.user
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        req.flash('error', 'Sản phẩm không tồn tại hoặc đã bị xóa!');
        return res.redirect('/admin/product');
    }

    next();
};