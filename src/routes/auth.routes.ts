import { Router } from 'express';
// Import từ Controller (Lùi lại 1 cấp thư mục để vào controllers)
import { getLoginPage, handleLogin, logoutUser } from '../controllers/auth.controller';

const router = Router();

// --- LOGIN ROUTES ---
router.get('/login', getLoginPage);   // Hiển thị form
router.post('/login', handleLogin);   // Xử lý dữ liệu form gửi lên

// --- LOGOUT ROUTE ---
router.get('/logout', logoutUser);    // Xử lý đăng xuất

export default router;