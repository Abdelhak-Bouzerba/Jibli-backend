import productService from "../services/product.service";
import { Request, Response } from "express";
import { IProduct } from "../types";

//Create a new product controller
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

//Get All products controller
export const getAllProducts = async (req: Request, res: Response) => {
  //Call the service to get all products
  const products = await productService.getAllProducts();

  //Send response
  res.status(200).json({
    message: "Products retrieved successfully",
    products,
  });
};

//Get single product controller
export const getProductById = async (req: Request, res: Response) => {
  //Extract productId from request params & check if it's provided
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({ message: "Product ID is required" });
    return;
  }

  //Call the service to get the product by ID
  const product = await productService.getProductById(productId as string);

  //Send response
  res.status(200).json({
    message: "Product retrieved successfully",
    product,
  });
};

//Update a product
export const updateProduct = async (req: Request, res: Response) => {
  // Extract product data from request body
  const data = req.body;
  const productId = req.params.productId as string;

  const isAvailable =
    data.isAvailable === "true"
      ? true
      : data.isAvailable === "false"
        ? false
        : undefined;

  // Only update image if a new image was uploaded
  if (req.file) {
    data.imageUrl = req.file.filename
      ? `${req.protocol}://${req.get("host")}/uploads/products/${req.file.filename}`
      : undefined;
  }

  //prepare productData object
  const productData: IProduct = {
    ...data,
    imageUrl: data.imageUrl,
    price: Number(data.price),
    preparationTime: Number(data.preparationTime),
    isAvailable,
  };

  //Call the service to update product
  const product = await productService.updateProduct(productId, productData);

  //Send response
  res.status(200).json({
    message: "product has been updated successfully",
    product,
  });
};

//Delete a product controller
export const deleteProduct = async (req: Request, res: Response) => {
  
  //Get productId from request params
  const productId = req.params.productId as string;

  //Call the service to delete the product
  await productService.deleteProduct(productId);

  //Send response
  res.status(200).json({
    message: "Product deleted successfully",
  });
};
