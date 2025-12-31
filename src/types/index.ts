export interface Worker {
  id: string;
  name: string;
  pin: string;
  active: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  points: number;
  quantity: number;
  active: boolean;
  createdAt: Date;
}

export interface SaleEntry {
  id: string;
  workerId: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    points: number;
  }[];
  totalPoints: number;
  createdAt: Date;
  isReturn?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  points: number;
  quantity: number;
}
