export interface IProduct {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  price: number | null;
}

export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number | null;
  items: string[];
}

export type TCatalogProduct = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>
export type TPreviewProduct = Pick<IProduct, 'category' | 'title' | 'image' | 'price' | 'description'>
