import { Request, Response } from "express";
export const getHomePage = ((req: Request, res: Response) => {
    res.render('client/home', {
        title: 'Trang chủ',
        message: 'Server đang chạy ổn định!'
    });
});
