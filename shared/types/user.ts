import type { Product } from "./product";

export interface User {
  id: string; // UUID from Supabase auth
  username: string;
  email: string;
  createTime: string; // ISO Date string
  profileImage?: string;
  bio?: string;
}

export interface UserPublicProfile extends User {
  products?: Product[]; // Creator's published products
  favorites?: Product[]; // Favorited products
}

export interface UserWithRelations extends User {
  follows?: FollowerMinimal[];
  following?: FollowerMinimal[];
  questions?: Question[];
  cartItems?: CartItem[];
  orders?: Order[];
  comments?: Comment[];
}

export interface FollowerMinimal {
  id: string;
  username: string;
  profileImage?: string;
}

export interface Question {
  questionID: number;
  questionType: string;
  content: string;
  response?: string;
}

export interface CartItem {
  productID: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  orderNumber: number;
  fullName: string;          // ✅ add
  address: string;
  totalPrice: number;
  purchaseTime: string;
  paymentStatus: string;     // ✅ add
  transactionID?: string;    // ✅ add
  orderItems: OrderItem[];
}


export interface OrderItem {
  productID: number;
  quantity: number;
  priceAtPurchase: number;
  product?: Product;
}

export interface Comment {
  productID: number;
  content: string;
  postTime: string;
}
