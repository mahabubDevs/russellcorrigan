import { Request, Response } from "express";
import { PriceService } from "./Product.service";

const calculatePrice = async (req: Request, res: Response) => {
  console.log("calculatePrice", req.body);
  try {
    console.log("calculatePrice try", req.body);
    const result = await PriceService.calculatePrice(req.body);
    console.log("calculatePrice result", result);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
};

export const ProductController = {
  calculatePrice,
};

// export const getPriceController = async (req: Request, res: Response) => {
//   try {
//     const result = await PriceService.getPrice(req.params.id);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       message: error.message || "Something went wrong",
//     });
//   }
// };
// export const getAllPricesController = async (req: Request, res: Response) => {
//   try {
//     const result = await PriceService.getAllPrices();
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       message: error.message || "Something went wrong",
//     });
//   }
// }