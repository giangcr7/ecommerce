import { Router } from "express";
import { getPageProduct, getCreateProductPage, createProduct, getEditProductPage, updateProduct, deleteProduct } from "../../controllers/admin/product.controller";
import upload from "../../middlewares/upload.middleware";
import { validateCreateProduct, validateUpdateProduct, validateDeleteProduct } from "../../middlewares/product.validate";
const router = Router();
//List product
router.get('/', getPageProduct);
//Create
router.get('/create', getCreateProductPage);
router.post('/create',
    upload.single('image'),
    validateCreateProduct,
    createProduct
);
//edit
router.get('/edit/:id', getEditProductPage);
router.post('/edit/:id',
    upload.single('image'),
    validateUpdateProduct,
    updateProduct
)
// --- DELETE ---
router.post('/delete/:id',
    validateDeleteProduct,
    deleteProduct
);

export default router;