import productService from "../services/product.service";
import { Request, Response } from "express";

//Create a new product controller
// export const createProduct = async (req: Request, res: Response) => {
//   //check if request body is empty
//   if (!req.body || Object.keys(req.body).length === 0) {
//     res.status(400).json({ message: "Product data is required" });
//     return;
//   }

//   //Extract product data from request body and prepare productData object
//   const data = req.body;
//   const productImage = req.file;
//   const productData = {
//     ...data,
//     imageUrl: productImage?.filename ? productImage.path : undefined,
//     price: Number(data.price),
//     preparationTime: Number(data.preparationTime),
//     isAvailable: data.isAvailable === "true" ? true : false,
//   };

//   //Call the service to create the product
//   const product = await productService.createProduct(productData);

//   //send response
//   res.status(201).send({ message: "Product created successfully", product });
// };

export const createProduct = async (req: Request, res: Response) => {
  // Check if request body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Product data is required" });
    return;
  }

  // Check if image was uploaded
  if (!req.file) {
    res.status(400).json({ message: "Product image is required" });
    return;
  }

  // Extract product data from request body
  const data = req.body;
  const productImage = req.file;

  const isAvailable =
    data.isAvailable === "true"
      ? true
      : data.isAvailable === "false"
        ? false
        : undefined;

  //prepare productData object
  const productData = {
    ...data,
    imageUrl: `${req.protocol}://${req.get("host")}/uploads/products/${productImage.filename}`,
    price: Number(data.price),
    preparationTime: Number(data.preparationTime),
    isAvailable,
  };

  // Call the service to create the product
  const product = await productService.createProduct(productData);

  // Send response
  res.status(201).json({
    message: "Product created successfully",
    product,
  });
};