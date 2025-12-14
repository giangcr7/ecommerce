import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prima';

// --- VALIDATE TẠO MỚI (CREATE) ---
export const validateCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        // 1. Kiểm tra trường bắt buộc
        if (!username || !email || !password) {
            req.flash('error', 'Vui lòng nhập đủ Username, Email và Password!');
            return res.redirect('/admin/user/create');
        }

        // 2. Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            req.flash('error', 'Mật khẩu phải có ít nhất 6 ký tự!');
            return res.redirect('/admin/user/create');
        }

        // 3. Kiểm tra trùng lặp (Username & Email)
        const [existingUsername, existingEmail] = await Promise.all([
            prisma.user.findUnique({ where: { username: username.trim() } }),
            prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
        ]);

        if (existingUsername) {
            req.flash('error', 'Username này đã có người sử dụng!');
            return res.redirect('/admin/user/create');
        }

        if (existingEmail) {
            req.flash('error', 'Email này đã tồn tại trong hệ thống!');
            return res.redirect('/admin/user/create');
        }

        next(); // OK -> Chuyển sang Controller

    } catch (error) {
        console.log(error);
        req.flash('error', 'Lỗi kiểm tra dữ liệu!');
        return res.redirect('/admin/user/create');
    }
};

// --- VALIDATE CẬP NHẬT (UPDATE) ---
export const validateUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { username, email } = req.body;

        if (isNaN(id)) {
            req.flash('error', 'ID người dùng không hợp lệ!');
            return res.redirect('/admin/user');
        }

        if (!username || !email) {
            req.flash('error', 'Username và Email không được để trống!');
            return res.redirect(`/admin/user/edit/${id}`);
        }

        // Kiểm tra trùng lặp TRỪ chính user đang sửa (NOT id)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username.trim() },
                    { email: email.trim().toLowerCase() }
                ],
                NOT: {
                    id: id // Loại trừ chính nó ra
                }
            }
        });

        if (existingUser) {
            req.flash('error', 'Username hoặc Email mới đã trùng với thành viên khác!');
            return res.redirect(`/admin/user/edit/${id}`);
        }

        next();

    } catch (error) {
        console.log(error);
        req.flash('error', 'Lỗi kiểm tra dữ liệu!');
        return res.redirect('/admin/user');
    }
};

// --- VALIDATE XÓA (DELETE) ---
export const validateDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        req.flash('error', 'ID không hợp lệ!');
        return res.redirect('/admin/user');
    }

    // Kiểm tra xem user có tồn tại để xóa không
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
        req.flash('error', 'Người dùng không tồn tại hoặc đã bị xóa!');
        return res.redirect('/admin/user');
    }

    next();
};