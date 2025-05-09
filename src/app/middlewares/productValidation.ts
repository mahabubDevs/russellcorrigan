import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

// validateRequest middleware function
const ProductvalidateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate req.body against the schema
      await schema.parseAsync(req.body);
      return next(); // Proceed to the next middleware/controller
    } catch (err) {
      // If validation fails, pass the error to the next middleware
      next(err);
    }
  };

export default ProductvalidateRequest;
