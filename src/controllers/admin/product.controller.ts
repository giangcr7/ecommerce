import { Response, Request } from "express";
import prisma from "../../config/prima";

// 1. GET: Danh sách sản phẩm
export const getPageProduct = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true }, // Join bảng Category để lấy tên
            orderBy: { id: 'desc' }
        });
        return res.render('admin/product/index', { title: 'Quản lý Product', products });
    } catch (error) {
        console.log(error);
        return res.render('admin/product/index', { title: 'Quản lý Product', products: [] });
    }
}

// 2. GET: Form tạo mới product
export const getCreateProductPage = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany();
        return res.render('admin/product/create', { title: 'Create New Product', categories });
    } catch (error) {
        console.log(error);
        return res.redirect('/admin/product');
    }
}

// 3. POST: Xử lý tạo mới product
export const createProduct = async (req: Request, res: Response) => {
    try {
        // Lấy dữ liệu (Lưu ý: Phải thêm quantity vào nếu Schema có)
        let { name, price, quantity, detailDesc, shortDesc, factory, target, categoryId } = req.body;
        const fileData = req.file;

        await prisma.product.create({
            data: {
                name: name.trim(),
                price: Number(price),
                quantity: Number(quantity), // Thêm số lượng
                detailDesc: detailDesc?.trim(),
                shortDesc: shortDesc?.trim(),
                factory: factory,
                target: target,
                categoryId: Number(categoryId), // Liên kết danh mục
                image: fileData ? fileData.path : null,
                sold: 0 // Mặc định khi tạo mới là 0
            }
        });

        req.flash('success', 'Thêm sản phẩm thành công!');
        return res.redirect('/admin/product');
    } catch (error: any) {
        console.log(error);
        req.flash('error', 'Lỗi Server: ' + error.message);
        return res.redirect('/admin/product/create');
    }
}

// ---------------------------------------------------------
// PHẦN BỔ SUNG: EDIT & DELETE
// ---------------------------------------------------------

// 4. GET: Form chỉnh sửa (Edit)
export const getEditProductPage = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        // Chạy song song: Tìm sản phẩm & Lấy danh sách danh mục
        const [product, categories] = await Promise.all([
            prisma.product.findUnique({ where: { id } }),
            prisma.category.findMany()
        ]);

        if (!product) {
            req.flash('error', 'Sản phẩm không tồn tại');
            return res.redirect('/admin/product');
        }

        return res.render('admin/product/edit', {
            title: 'Edit Product',
            product,
            categories
        });

    } catch (error) {
        console.log(error);
        return res.redirect('/admin/product');
    }
}

// 5. POST: Xử lý cập nhật (Update)
export const updateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        let { name, price, quantity, detailDesc, shortDesc, factory, target, categoryId } = req.body;
        const fileData = req.file;

        // Chuẩn bị dữ liệu update
        let updateData: any = {
            name: name.trim(),
            price: Number(price),
            quantity: Number(quantity),
            detailDesc: detailDesc?.trim(),
            shortDesc: shortDesc?.trim(),
            factory: factory,
            target: target,
            categoryId: Number(categoryId)
        };

        // Logic ảnh: Chỉ cập nhật nếu có file mới
        if (fileData) {
            updateData.image = fileData.path;
        }

        await prisma.product.update({
            where: { id: id },
            data: updateData
        });

        req.flash("success", "Cập nhật thành công sản phẩm ID: " + id);
        return res.redirect('/admin/product');

    } catch (error: any) {
        console.log(error);
        req.flash('error', 'Lỗi cập nhật: ' + error.message);
        return res.redirect(`/admin/product/edit/${id}`);
    }
}

// 6. POST: Xử lý xóa (Delete)
export const deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        await prisma.product.delete({ where: { id } });

        req.flash('success', 'Đã xóa sản phẩm thành công!');
        return res.redirect('/admin/product');

    } catch (error: any) {
        // Lỗi P2003: Foreign Key Constraint (Sản phẩm đang nằm trong Order)
        if (error.code === 'P2003') {
            req.flash('error', 'Không thể xóa: Sản phẩm này đã có lịch sử mua hàng!');
        } else {
            req.flash('error', 'Lỗi Server: ' + error.message);
        }
        return res.redirect('/admin/product');
    }
}