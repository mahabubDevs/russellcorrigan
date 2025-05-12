// import { Request, Response } from "express";
// import { PriceService} from "./Product.service";

import { fileUploader } from "../../../helpars/fileUploader";
import catchAsync from "../../../shared/catchAsync"
import { Request, Response } from "express";
import { ProductService } from "./Product.service";

// // PriceCalculation করতে গেলে UserId সহ ডেটা নিতে হবে
// const calculatePrice = async (req: Request, res: Response) => {
//   console.log("calculatePrice", req.body);

//   try {
//     // এখানে আমরা req.body তে userId পাঠানোর কথা বলছি
//     // আগে থেকেই userId req.body তে পাস করা হলে, তা priceCalculation এ সঠিকভাবে অন্তর্ভুক্ত হবে

//     console.log("calculatePrice try", req.body);

//     // PriceCalculation করার সময় req.body তে userId থাকতে হবে
//     const result = await PriceService.calculatePrice(req.body);
//     console.log("calculatePrice result", result);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       message: error.message || "Something went wrong",
//     });
//   }
// };


// const getAllPrices = async (req: Request, res: Response) => {
//   try {
//     const result = await PriceService.getAll(req.params.id);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       message: error.message || "Something went wrong",
//     });
//   }
// }


// export const ProductController = {
//   calculatePrice,
//   getAllPrices,
// };


const createProduct = catchAsync (async (req:Request, res:Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const body = JSON.parse(req.body.data);
  let imageUrls: string[] = [];

  if(files?.images && files.images.length > 0 ) {
    const uploads = await Promise.all(
      files.imaes.map(async (file) =>{
        const uploaded = await fileUploader.uploadToCloudinary(file);
        return uploaded.Location;
      })
    );
    imageUrls = uploads;
  }



const userPayload = {
  ...body,
  images: imageUrls, // Attach uploaded image URLs
};


const product = await ProductService.createProduct(userPayload);
res.status(201).json({
  success: true,
  message: "Product created successfully!",
  data: product,
});
});



export const ProductController = {
  createProduct,
};

