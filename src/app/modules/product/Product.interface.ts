export interface PriceRequest {
  serviceType: "snow" | "lawn";
  area: number;
  driveways?: ("1-car" | "2-car" | "3-car")[];
  isCornerLot?: boolean;
  extraFeet?: number;
  isSteep?: boolean;
  isPriority?: boolean;
}

export interface PriceResponse {
  basePrice: number;
  additionsPrice: number;
  totalPrice: number;
}
