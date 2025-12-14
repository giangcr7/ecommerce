import express, { Application } from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import { localsMiddleware } from './middlewares/locals.middleware';
dotenv.config();

import indexRoutes from './routes/index.routes';
import dashboardRoutes from "./routes/admin/dashboard.routes";
import userRoutes from './routes/admin/user.routes';
import pageRoutes from './routes/admin/product.routes';


const app: Application = express();

// 1. Middlewares cơ bản
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key_mac_dinh_123',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(localsMiddleware);

// 4. View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 5. Routes
app.use('/', indexRoutes);
app.use('/admin', dashboardRoutes);
app.use('/admin/user', userRoutes);
app.use('/admin/product', pageRoutes);


export default app;