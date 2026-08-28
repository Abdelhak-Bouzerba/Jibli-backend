import { Request, Response, NextFunction } from "express";
import productRepository from "../repositories/product";
import restaurantRepository from "../repositories/restaurant";

// export const authorizeRestaurant = async (req: Request, res: Response, next: NextFunction,) => {
//   const restaurantId = req.user?.id as string;
//   const rsId = req.params.restaurantId as string;
//   const productId = req.params.productId as string;

//   const product = await productRepository.getProductById(productId);

//     const rs = await restaurantRepository.getRestaurantById(restaurantId);
//     if (!rs) {
//       res.status(404).json({
//         message: "Restaurant not found",
//       });
//       return;
//     }

//     if (!restaurantId || restaurantId !== rs._id.toString() || restaurantId !== product?.restaurantId.toString()) {
//       res.status(403).json({
//         message: "You are not authorized",
//       });
//       return;
//     }

//   next();

// }

export const authorizeRestaurant = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const restaurantId = req.user?.id;

    if (!restaurantId) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const rsId = req.params.restaurantId as string;
    const productId = req.params.productId as string;

    // Route contains restaurantId
    if (rsId) {
      if (restaurantId !== rsId) {
        res.status(403).json({
          message: "You are not authorized",
        });
        return;
      }

      next();
      return;
    }

    // Route contains productId
    if (productId) {
      const product = await productRepository.getProductById(productId);

      if (!product) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      }

      if (restaurantId !== product.restaurantId.toString()) {
        res.status(403).json({
          message: "You are not authorized",
        });
        return;
      }

      next();
      return;
    }

    res.status(400).json({
      message: "Missing resource identifier",
    });
  } catch (error) {
    next(error);
  }
};
