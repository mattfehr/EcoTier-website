export type ProductType = "towers" | "modules" | "addons";

export interface Product {
  id: number;
  name: string;
  price: number;
  productType: ProductType;
  creator: { id: string; name: string; profileImage: string };
  imageUrl: string;
}
