import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// 1. GET: Hiển thị trang đăng nhập
export const getLoginPage = (req: Request, res: Response) => {
    // Nếu user đã đăng nhập rồi thì đá thẳng vào Admin, không cho ra login nữa
    if (req.isAuthenticated()) {
        return res.redirect('/admin');
    }

    // Render file view: src/views/auth/login.ejs
    return res.render('auth/login', {
        title: 'Đăng Nhập Quản Trị'
    });
};

// 2. POST: Xử lý đăng nhập
export const handleLogin = (req: Request, res: Response, next: NextFunction) => {
    // Gọi Passport để xác thực
    passport.authenticate('local', {
        successRedirect: '/admin',       // Đăng nhập đúng -> Vào Dashboard
        failureRedirect: '/login',       // Đăng nhập sai -> Quay lại Login
        failureFlash: true               // Bật thông báo lỗi (Flash)
    })(req, res, next);
};

// 3. GET: Xử lý đăng xuất
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) { return next(err); }

        req.flash('success', 'Đã đăng xuất thành công!');
        return res.redirect('/login');
    });
};