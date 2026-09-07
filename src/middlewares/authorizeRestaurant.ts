import { Request, Response, NextFunction } from "express";
import productRepository from "../repositories/product";
import restaurantRepository from "../repositories/restaurant";
import { ApiError } from "../utils/apiError";

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

export const authorizeRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const restaurantId = req.user?.id;

    if (!restaurantId) {
      return next(new ApiError(401, "Authentication required"));
    }

    const rsId = req.params.restaurantId as string;
    const productId = req.params.productId as string;

    // Route contains restaurantId
    if (rsId) {
      if (restaurantId !== rsId) {
        return next(new ApiError(403, "You are not authorized"));
      }

      next();
      return;
    }

    // Route contains productId
    if (productId) {
      const product = await productRepository.getProductById(productId);

      if (!product) {
        return next(new ApiError(404, "Product not found"));
      }

      if (restaurantId !== product.restaurantId.toString()) {
        return next(new ApiError(403, "You are not authorized"));
      }

      next();
      return;
    }

    return next(new ApiError(400, "Missing resource identifier"));
  } catch (error) {
    next(error);
  }
};
