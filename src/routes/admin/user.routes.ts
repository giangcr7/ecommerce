import { Router } from 'express';

// Import Controller
import {
    getUserPage,
    getCreateUserPage,
    createUser,
    deleteUser,
    getEditUserPage,
    editUser
} from '../../controllers/admin/user.controller';

// Import Middleware Upload & Validate
import upload from '../../middlewares/upload.middleware';
import {
    validateCreateUser,
    validateUpdateUser,
    validateDeleteUser
} from '../../middlewares/user.validate';

const router = Router();

// --- LIST ---
router.get('/', getUserPage);

// --- CREATE ---
// Quy trình: Vào trang -> Submit Form -> Upload Ảnh -> Check Dữ Liệu -> Lưu DB
router.get('/create', getCreateUserPage);
router.post('/create',
    upload.single('avatar'),
    validateCreateUser,
    createUser
);

// --- EDIT ---
router.get('/edit/:id', getEditUserPage);
router.post('/edit/:id',
    upload.single('avatar'),
    validateUpdateUser,
    editUser
);

// --- DELETE ---
router.post('/delete/:id',
    validateDeleteUser,
    deleteUser
);

export default router;