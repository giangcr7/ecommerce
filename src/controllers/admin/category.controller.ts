import { Request, Response } from "express";
import prisma from "../../config/prima";

// 1. GET: Danh sách danh mục
export const getCategoryPage = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
            orderBy: { id: 'desc' }
        });
        return res.render('admin/category/index', { title: 'Quản lý Danh mục', categories });
    } catch (error) {
        console.log(error);
        return res.render('admin/category/index', { title: 'Quản lý Danh mục', categories: [] });
    }
}

// 2. GET: Form tạo mới
export const getCreateCategoryPage = (req: Request, res: Response) => {
    return res.render('admin/category/create', { title: 'Thêm Danh mục' });
}

// 3. POST: Tạo mới
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        await prisma.category.create({
            data: { name, description }
        });
        req.flash('success', 'Thêm danh mục thành công!');
        return res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Lỗi: ' + error);
        return res.redirect('/admin/category/create');
    }
}

// 4. GET: Form sửa
export const getEditCategoryPage = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const category = await prisma.category.findUnique({ where: { id } });
    return res.render('admin/category/edit', { title: 'Sửa Danh mục', category });
}

// 5. POST: Cập nhật
export const updateCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    try {
        await prisma.category.update({
            where: { id },
            data: { name, description }
        });
        req.flash('success', 'Cập nhật thành công!');
        return res.redirect('/admin/category');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Lỗi cập nhật!');
        return res.redirect(`/admin/category/edit/${id}`);
    }
}

// 6. POST: Xóa
export const deleteCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        await prisma.category.delete({ where: { id } });
        req.flash('success', 'Xóa thành công!');
        return res.redirect('/admin/category');
    } catch (error: any) {
        if (error.code === 'P2003') {
            req.flash('error', 'Không thể xóa: Danh mục này đang chứa sản phẩm!');
        } else {
            req.flash('error', 'Lỗi: ' + error.message);
        }
        return res.redirect('/admin/category');
    }
}