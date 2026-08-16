import { Request, Response, NextFunction } from "express";



const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if ((req as any).user.role !== role) {
            res.status(403).json({ message: "Forbidden: You do not have the required role" });
            return;
        }
        next();
    }
};

export default requireRole;