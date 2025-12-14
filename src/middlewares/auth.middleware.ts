import { Request, Response, NextFunction } from 'express';

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    // Hàm isAuthenticated() do Passport cung cấp: trả về true nếu đã login
    if (req.isAuthenticated()) {
        return next(); // Đã login -> Cho đi tiếp vào Admin
    }

    // Chưa login -> Đá về trang đăng nhập
    // req.flash('error', 'Vui lòng đăng nhập để truy cập!'); // (Optional)
    return res.redirect('/login');
};