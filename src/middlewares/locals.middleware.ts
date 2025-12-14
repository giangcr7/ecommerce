import { Request, Response, NextFunction } from 'express';

export const localsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();
};