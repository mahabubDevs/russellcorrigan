import { PriceRequest, PriceResponse } from "../product/Product.interface";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

// Utility function: calculate base price
const getBasePrice = (area: number): number => {
  if (area <= 3000) return 45 + 45 * 0.10;       // $45 + 10%
  if (area <= 5000) return 65 + 65 * 0.10;       // $65 + 10%
  if (area <= 8000) return 85 + 85 * 0.10;       // $85 + 10%
  if (area <= 12000) return 100 + 100 * 0.10;    // $100 + 10%

  // If area is larger, calculate per square foot
  const base = area * 0.01;                      // Assume $0.01 per sq ft
  return base + base * 0.10;                     // + 10% extra
};

// Utility function: calculate additional snow service charges
const calculateAdditionsPrice = (data: PriceRequest): number => {
  let additions = 0;

  // Driveways
  if (data.driveways && data.driveways.length > 0) {
    data.driveways.forEach((type) => {
      if (type === "1-car") additions += 45;
      if (type === "2-car") additions += 65;
      if (type === "3-car") additions += 85;
    });
  }

  // Corner Lot
  if (data.isCornerLot) additions += 15;

  // Extra Feet
  if (data.extraFeet && data.extraFeet > 0) {
    additions += Math.ceil(data.extraFeet / 20) * 10;
  }

  // Steep Driveway
  if (data.isSteep) additions += 15;

  // Priority
  if (data.isPriority) additions += 20;

  return additions;
};

// Main: Calculate total price
const calculatePrice = async (data: PriceRequest): Promise<PriceResponse> => {
  console.log("Calculating price for data:", data);

  // Ensure we have userId for tracking purposes
  if (!data.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required.");
  }

  const basePrice = getBasePrice(data.area);

  if (basePrice === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Custom quote area. Please contact support.");
  }

  let additionsPrice = 0;

  if (data.serviceType === "snow") {
    additionsPrice = calculateAdditionsPrice(data);
  }

  const totalPrice = basePrice + additionsPrice;

  // Save to database and associate with the user
  await prisma.priceCalculation.create({
    data: {
      serviceType: data.serviceType,
      area: data.area,
      driveways: data.driveways || [],
      isCornerLot: data.isCornerLot || false,
      extraFeet: data.extraFeet || 0,
      isSteep: data.isSteep || false,
      isPriority: data.isPriority || false,
      basePrice,
      additionsPrice,
      totalPrice,
      userId: data.userId,  // Store the userId here
    },
  });

  return {
    basePrice,
    additionsPrice,
    totalPrice,
  };
};

const getAll = async (userId: string) => {
  const prices = await prisma.priceCalculation.findMany({
    where: { userId },
  });
  return prices.map((price) => ({
    id: price.id,
    serviceType: price.serviceType,
    area: price.area,
    driveways: price.driveways,
    isCornerLot: price.isCornerLot,
    extraFeet: price.extraFeet,
    isSteep: price.isSteep,
    isPriority: price.isPriority,
    basePrice: price.basePrice,
    additionsPrice: price.additionsPrice,
    totalPrice: price.totalPrice,
  }));
};


const getPriceById = async (id: string) => {
  const price = await prisma.priceCalculation.findUnique({
    where: { id },
  });
  if (!price) {
    throw new ApiError(httpStatus.NOT_FOUND, "Price calculation not found.");
  }
  return price;
};






export const PriceService = {
  calculatePrice,
  getPriceById,
  getAll
};
