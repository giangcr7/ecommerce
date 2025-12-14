import { Request, Response } from 'express';
import prisma from '../../config/prima';
import bcrypt from 'bcryptjs';

// --- 1. GET: Danh sách User ---
export const getUserPage = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: { role: true },
            orderBy: { id: 'desc' }
        });
        return res.render('admin/user/index', { title: 'Quản lý Users', users });
    } catch (error) {
        console.log(error);
        return res.render('admin/user/index', { title: 'Quản lý Users', users: [] });
    }
}

// --- 2. GET: Form Tạo mới ---
export const getCreateUserPage = async (req: Request, res: Response) => {
    const roles = await prisma.role.findMany();
    return res.render('admin/user/create', { title: 'Tạo User Mới', roles });
}

// --- 3. POST: Xử lý Tạo mới ---
export const createUser = async (req: Request, res: Response) => {
    try {
        let { username, email, password, fullName, phone, address, roleId } = req.body;
        const fileData = req.file;

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu vào DB
        await prisma.user.create({
            data: {
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: hashedPassword,
                fullName: fullName?.trim(),
                phone,
                address,
                avatar: fileData ? fileData.path : null,
                roleId: Number(roleId),
                accountType: 'local'
            }
        });

        req.flash('success', 'Thêm thành viên thành công!');
        return res.redirect('/admin/user');

    } catch (error: any) {
        console.log(error);
        req.flash('error', 'Lỗi Server: ' + error.message);
        return res.redirect('/admin/user/create');
    }
}

// --- 4. GET: Form Chỉnh sửa ---
export const getEditUserPage = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const [user, roles] = await Promise.all([
            prisma.user.findUnique({ where: { id } }),
            prisma.role.findMany()
        ]);

        if (!user) {
            req.flash('error', 'User không tồn tại');
            return res.redirect('/admin/user');
        }

        return res.render('admin/user/edit', { title: 'Sửa User', user, roles });
    } catch (error) {
        console.log(error);
        return res.redirect('/admin/user');
    }
}

// --- 5. POST: Xử lý Cập nhật (Edit) ---
export const editUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        let { username, email, password, fullName, phone, address, roleId } = req.body;
        const fileData = req.file;

        // Chuẩn bị dữ liệu update
        let updateData: any = {
            username: username.trim(),
            email: email.trim().toLowerCase(),
            fullName: fullName?.trim(),
            phone,
            address,
            roleId: Number(roleId)
        };

        // Logic Pass: Chỉ hash nếu có nhập mới
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Logic Avatar: Chỉ update nếu có upload file mới
        if (fileData) {
            updateData.avatar = fileData.path;
        }

        await prisma.user.update({
            where: { id: id },
            data: updateData
        });

        req.flash("success", "Cập nhật thành công User ID: " + id);
        return res.redirect('/admin/user');

    } catch (error: any) {
        console.log(error);
        req.flash('error', 'Lỗi cập nhật: ' + error.message);
        return res.redirect(`/admin/user/edit/${id}`);
    }
}

// --- 6. POST: Xử lý Xóa (Delete) ---
export const deleteUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        await prisma.user.delete({ where: { id } });

        req.flash('success', 'Đã xóa thành công User ID: ' + id);
        return res.redirect('/admin/user');

    } catch (error: any) {
        // Bắt lỗi ràng buộc khóa ngoại (User đang có đơn hàng/bài viết)
        if (error.code === 'P2003') {
            req.flash('error', 'Không thể xóa: User này đang có dữ liệu liên quan');
        } else {
            req.flash('error', 'Lỗi Server: ' + error.message);
        }
        return res.redirect('/admin/user');
    }
}