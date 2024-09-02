interface IProductItem {
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

type ProductCatalog = Pick<IProductItem, 'id' | 'category' | 'title' | 'image' | 'price'>;

type ProductPreview = Pick<IProductItem, 'id' | 'category' | 'title' | 'description' | 'image' | 'price'>;

type ProductBasket = Pick<IProductItem, 'id' | 'title' | 'price'>;

type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

interface IModalView {
  content: HTMLElement;
}

interface IPageView {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

interface IPreviewView {
  selected: string[];
}

interface IBasketView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

interface IFormView {
  valid: boolean;
  errors: string[];
}

interface IProductAPI {
  getProductList: () => Promise<IProductItem[]>;
  getProductItem: (id: string) => Promise<IProductItem>;
  addOrder: (object: IOrder) => Promise<IOrder>;
}