import express from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

// import { ProductValidation } from "./Product.validation";
import ProductvalidateRequest from "../../middlewares/productValidation";
import { fileUploader } from "../../../helpars/fileUploader";
import { ProductValidation } from "./Product.validation";
import { ProductController } from "./Product.controller";

const router = express.Router();

// Price Calculation Route
router.post(
  "/",
  auth(UserRole.Customer),
  fileUploader.uploadMultipleImage,
  ProductvalidateRequest(ProductValidation.productValidationSchema),
  ProductController.createProduct
);


router.get("/:id", auth(UserRole.Customer), ProductController.getAllPrices);
router.delete("/:id", auth(UserRole.Customer), ProductController.deleteProduct);
router.put("/:id", auth(UserRole.Customer), ProductController.updateProduct);
// router.post("/", fileUploader.uploadSingle, handleCreateProduct);
// router.get("/get-product/:id", auth(UserRole.Customer), ProductController.getAllPrices);

export const ProductRoutes = router;







