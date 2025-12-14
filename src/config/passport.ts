import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from './prima';
import bcrypt from 'bcryptjs';

export default function configPassport() {
    // 1. Cấu hình chiến lược "Local" (Đăng nhập bằng Email/Password)
    passport.use(new LocalStrategy({
        usernameField: 'email',      // Tên ô input bên view là 'email'
        passwordField: 'password',   // Tên ô input bên view là 'password'
    }, async (email, password, done) => {
        try {
            // Tìm user trong DB
            const user = await prisma.user.findUnique({
                where: { email: email }
            });

            // Nếu không tìm thấy user
            if (!user) {
                return done(null, false, { message: 'Email không tồn tại!' });
            }

            // So sánh mật khẩu (password nhập vào vs password đã mã hóa trong DB)
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Mật khẩu không đúng!' });
            }

            // Đăng nhập thành công -> Trả về user
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }));

    // 2. Serialize: Lưu thông tin gì vào Session? (Lưu ID cho nhẹ)
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // 3. Deserialize: Từ ID trong Session, lấy ra thông tin User đầy đủ
    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                include: { role: true } // Lấy luôn quyền hạn
            });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}