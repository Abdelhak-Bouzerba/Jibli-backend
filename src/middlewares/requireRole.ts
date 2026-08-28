import { Request, Response, NextFunction } from "express";



const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    }
};

export default requireRole;