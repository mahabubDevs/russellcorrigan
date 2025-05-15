
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

import { CreatePropertyInterface } from "./Property.interface";
// import { ProductStatus } from "@prisma/client";


const getBasePrice = (area: number): number => {
  if (area <= 3000) return 45 + 45 * 0.10;       // $45 + 10%
  if (area <= 5000) return 65 + 65 * 0.10;       // $65 + 10%
  if (area <= 8000) return 85 + 85 * 0.10;       // $85 + 10%
  if (area <= 12000) return 100 + 100 * 0.10;    // $100 + 10%

  // If area is larger, calculate per square foot
  const base = area * 0.01;                      // Assume $0.01 per sq ft
  return base + base * 0.10;                     // + 10% extra
};

// const calculateAdditionsPrice = (data: any): number => {
//   let additions = 0;

//   // Driveways
//   if (data.driveways && data.driveways.length > 0) {
//     data.driveways.forEach((type:any) => {
//       if (type === "1-car") additions += 45;
//       if (type === "2-car") additions += 65;
//       if (type === "3-car") additions += 85;
//     });
//   }


//   if (data.isCornerLot) additions += 15;


//   if (data.extraFeet && data.extraFeet > 0) {
//     additions += Math.ceil(data.extraFeet / 20) * 10;
//   }


//   if (data.isSteep) additions += 15;

//   // Priority
//   if (data.isPriority) additions += 20;

//   return additions;
// };


const createProperty = async (data: CreatePropertyInterface ) => {
  console.log("Calculating price for data:", data);

  // Ensure we have userId for tracking purposes
  if (!data.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required.");
  }

  const basePrice = getBasePrice(data.area);

  if (basePrice === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Custom quote area. Please contact support.");
  }

  
  

//   // Save to database and associate with the user
 const property =  await prisma.property.create({
  data: {
    
    address: data.address || "Unknown Address", 
    location: data.location || "Unknown",        
    perimeter: data.perimeter || 0,              
    area: data.area,
    lat: isNaN(Number(data.lat)) ? 0 : Number(data.lat),  
    lng: isNaN(Number(data.lng)) ? 0 : Number(data.lng),  
   
    basePrice: basePrice || 0,
   
    userId: data.userId,
  
  },
});
  return {
    property,
  };
};


const getAllProperty = async (userId: string) => {
  const property = await prisma.property.findMany({
    where: { userId },
  });
  return property.map((property) => ({
    id: property.id,
    address: property.address,
    location: property.location,
 
    perimeter: property.perimeter,
    area: property.area,
  
    basePrice: property.basePrice,
    
  }));
};



const deleteProperty = async (id: string) => {
  const product = await prisma.property.findUnique({
    where: { id },
  });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Property not found.");
    }
    await prisma.property.delete({
        where: { id },
    });
    return { message: "Property deleted successfully." };
}


const updateProperty = async ( data: CreatePropertyInterface, id: string,) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });
    if (!property) {
        throw new ApiError(httpStatus.NOT_FOUND, "Property not found.");
    }
    const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
            ...data,
           
        },
    });
    return updatedProperty;
}



export const PropertyService = {
  createProperty,
  getAllProperty,
  deleteProperty,
  updateProperty
  // getPriceById,
  // getAll,
  // deleteProduct,
  // updateProduct,
  // updateProjectImage
};


