export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface EnquiryBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId: number;
  productTitle: string;
}
