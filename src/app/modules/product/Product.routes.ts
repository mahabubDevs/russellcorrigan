import express from "express";
import { ProductController } from "./Product.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import { ProductValidation } from "./Product.validation";
import ProductvalidateRequest from "../../middlewares/productValidation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

// Price Calculation Route
router.post(
  "/calculate",
  auth(UserRole.Customer),
  ProductvalidateRequest(ProductValidation.priceValidationSchema),
  
  ProductController.calculatePrice
);
// router.get("/get-product/:id", auth(UserRole.Customer), ProductController.getAllPrices);

export const ProductRoutes = router;
