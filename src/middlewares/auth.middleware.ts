import { Request, Response, NextFunction } from 'express';

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
};