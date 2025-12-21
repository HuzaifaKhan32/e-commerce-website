
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface CartItem {
  id: string; // unique ID for the cart entry (product + color)
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color: string;
}
