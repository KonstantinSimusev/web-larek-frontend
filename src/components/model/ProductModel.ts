import { IEvents } from "../base/events";
import { IProduct } from "../../types";

export class ProductModel {
  protected catalogItems: IProduct[];
  protected basketItems: IProduct[] = [];

  constructor(protected events: IEvents) {
    this.events = events;
  }
  
  set catalog(items: IProduct[]) {
    this.catalogItems = items;
    this.events.emit('items:changed');
  }

  get catalog() {
    return this.catalogItems;
  }

  get count() {
    return this.basketItems.length;
  }

  get total() {
    return this.basketItems.reduce((total, item) => total + item.price, 0);
  }

  get basket(): IProduct[] {
    return this.basketItems;
  }

  get basketItemsId(): string[] {
    return this.basketItems.map(item => item.id);
  }

  getItem(id: string): IProduct {   
    return this.catalogItems.find(item => item.id === id);
  }

  isToBasket(id: string): boolean {
    if (this.basketItems.filter(item => item.id === id).length) return true;
    else return false;
  }

  clearBasket(): IProduct[] {
    this.events.emit('items:changed');
    return this.basketItems = [];
  }

  addToBasket(item: IProduct) {
    this.basketItems.push(item);
    this.events.emit('items:changed');
  }

  deleteFromBasket(id: string): IProduct[] {
    this.basketItems = this.basketItems.filter(item => item.id !== id);
    this.events.emit('items:changed');
    return this.basketItems;
  }

  isPriceless(item: IProduct) {
    if (item.price) return true;
    else return false;
  }
}