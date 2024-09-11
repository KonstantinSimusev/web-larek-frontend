import { IEvents } from "../base/events";
import { IOrder } from "../../types";
import { ProductModel } from "./ProductModel";

export class OrderModel {
  protected order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };

  constructor(protected events: IEvents) {
    this.events = events;
  }

  createOrder(object: ProductModel) {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
      total: object.total,
      items: object.basketItemsId
    }
  }

  set payment(value: string) {
    this.order.payment = value;
  }

  get payment() {
    return this.order.payment;
  }

  set address(value: string) {
    this.order.address = value;
  }
  
  get address() {
    return this.order.address;
  }

  set email(value: string) {
    this.order.email = value;
  }

  get email() {
    return this.order.email;
  }

  set phone(value: string) {
    this.order.phone = value;
  }
  
  get phone() {
    return this.order.phone;
  }

}