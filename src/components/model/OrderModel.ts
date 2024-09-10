import { IEvents } from "../base/events";
import { IOrder } from "../../types" 

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