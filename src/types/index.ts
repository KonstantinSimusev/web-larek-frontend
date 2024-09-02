interface IProduct {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  price: number | null;
}

interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: string[];
}