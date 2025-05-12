import { Request, Response } from "express";
import { PriceService} from "./Product.service";
import { fileUploader } from "../../../helpars/fileUploader";


// PriceCalculation করতে গেলে UserId সহ ডেটা নিতে হবে
const createProduct = async (req: Request, res: Response) => {
  console.log("calculatePrice", req.body);


  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
     // Parse the JSON string from "data"
  
    let imageUrls: string[] = [];
  
    if (files?.images && files.images.length > 0) {
      const uploads = await Promise.all(
        files.images.map(async (file) => {
          // Upload to Cloudinary (or switch to uploadToDigitalOcean if needed)
          const uploaded = await fileUploader.uploadToCloudinary(file);
          return uploaded.Location;
        })
      );
      imageUrls = uploads;
    }
  
    // Combine user data with image URLs
 
  try {
    // এখানে আমরা req.body তে userId পাঠানোর কথা বলছি
    // আগে থেকেই userId req.body তে পাস করা হলে, তা priceCalculation এ সঠিকভাবে অন্তর্ভুক্ত হবে

    console.log("calculatePrice try", req.body);

    // PriceCalculation করার সময় req.body তে userId থাকতে হবে
    const result = await PriceService.createProduct(req.body,imageUrls);
    console.log("calculatePrice result", result);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
};


const getAllPrices = async (req: Request, res: Response) => {
  try {
    const result = await PriceService.getAll(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong",
    });
  }
}


export const ProductController = {
  createProduct,
  getAllPrices,
};


// const createProduct = catchAsync (async (req:Request, res:Response) => {
//   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//   const body = JSON.parse(req.body.data);
//   console.log("createProduct body", body);
//   let imageUrls: string[] = [];

//   if(files?.images && files.images.length > 0 ) {
//     const uploads = await Promise.all(
//       files.images.map(async (file) =>{
//         const uploaded = await fileUploader.uploadToCloudinary(file);
//         return uploaded.Location;
//       })
//     );
//     imageUrls = uploads;
//   }



// const userPayload = {
//   ...body,
//   images: imageUrls, // Attach uploaded image URLs
// };


// const product = await ProductService.createProduct(userPayload);
// res.status(201).json({
//   success: true,
//   message: "Product created successfully!",
//   data: product,
// });
// });


































