// shared/types/product.ts
export type ProductType = "towers" | "modules" | "addons";

export interface Product {
  productID: number;                  // matches Prisma
  name: string;
  price: number;
  productType: ProductType;
  creatorID: string;                  // foreign key
  creator?: {                         // optional join from backend
    id: string;
    username: string;
    profileImage?: string;
  };
  public: boolean;
  createTime: string;                 // serialized DateTime
  updateTime: string;                 // serialized DateTime
  description?: string;
  PIN?: string;
  imageURL?: string;
}
