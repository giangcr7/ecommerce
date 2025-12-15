import express, { Application } from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import passport from 'passport';

// Import Middleware & Config
import { localsMiddleware } from './middlewares/locals.middleware';
import configPassport from './config/passport';
import { checkLogin } from './middlewares/auth.middleware';

// Import Routes
// 👇 [SỬA LẠI] Thêm /routes/ vào đường dẫn
import authRoutes from './routes/auth.routes';
import indexRoutes from './routes/index.routes';
import dashboardRoutes from "./routes/admin/dashboard.routes";
import userRoutes from './routes/admin/user.routes';
import productRoutes from './routes/admin/product.routes';
import categoryRoutes from './routes/admin/category.routes';
dotenv.config();

const app: Application = express();

// 1. View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 2. Middlewares Cốt lõi
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 3. Cấu hình Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_mac_dinh_123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// 4. Cấu hình Passport
configPassport();
app.use(passport.initialize());
app.use(passport.session());

// 5. Flash & Locals
app.use(flash());
app.use(localsMiddleware);

// 6. Routes

// A. Routes Công khai
app.use('/', authRoutes);  // Login, Register, Logout
app.use('/', indexRoutes); // Trang chủ

// B. Routes Bảo mật
app.use('/admin', checkLogin, dashboardRoutes);
app.use('/admin/user', checkLogin, userRoutes);
app.use('/admin/product', checkLogin, productRoutes);
app.use('/admin/category', checkLogin, categoryRoutes);
export default app;