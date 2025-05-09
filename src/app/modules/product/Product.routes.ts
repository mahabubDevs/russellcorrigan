import express from "express";
import { ProductController } from "./Product.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

import { ProductValidation } from "./Product.validation";
import ProductvalidateRequest from "../../middlewares/productValidation";

const router = express.Router();

// Price Calculation Route
router.post(
  "/calculate",
  auth(UserRole.Customer),
  ProductvalidateRequest(ProductValidation.priceValidationSchema),
  ProductController.calculatePrice
);

export const ProductRoutes = router;
