import { Router } from "express";
import {
    getCategoryPage, getCreateCategoryPage, createCategory,
    getEditCategoryPage, updateCategory, deleteCategory
} from "../../controllers/admin/category.controller";

const router = Router();

router.get('/', getCategoryPage);

router.get('/create', getCreateCategoryPage);
router.post('/create', createCategory);

router.get('/edit/:id', getEditCategoryPage);
router.post('/edit/:id', updateCategory);

router.post('/delete/:id', deleteCategory);

export default router;