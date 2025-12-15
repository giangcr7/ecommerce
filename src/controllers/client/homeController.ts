import { Request, Response } from "express";
import prisma from "../../config/prima";

export const getHomePage = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            take: 12,
            orderBy: { id: 'desc' },
            include: { category: true }
        });

        // --- SỬA LẠI ĐOẠN RETURN NÀY ---
        return res.render('client/home', {
            title: 'GShop - Cửa hàng công nghệ',
            products: products,
            user: req.user || null
        });

    } catch (error) {
        console.log(error);
        return res.send("Lỗi tải trang chủ");
    }
}