import { Request, Response } from "express";
export const renderDashBoard = (req: Request, res: Response) => {
    res.render("admin/dashboard"),
        { title: "Admin Dashboard" };
};