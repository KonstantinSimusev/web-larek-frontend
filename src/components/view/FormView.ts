import { IOrder } from "../../types";
import { EventEmitter } from "../base/events";
import { Component } from "../base/Component";

export class OrderView extends Component<IOrder> {
  protected onlineButton: HTMLButtonElement;
  protected getButton: HTMLButtonElement;
  protected inputField: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected error: HTMLElement;
  protected formName: string;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container);
    this.onlineButton = this.container.querySelector('.button_online') as HTMLButtonElement;
    this.getButton = this.container.querySelector('.button_get') as HTMLButtonElement;
    this.inputField = this.container.querySelector('.form__input') as HTMLInputElement;
    this.submitButton = this.container.querySelector('.order__button') as HTMLButtonElement;
    this.error = this.container.querySelector('.form__errors') as HTMLElement;
    this.formName = this.container.getAttribute('name');

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('forward:submit', {value: this.inputField.value});
    });

    this.onlineButton.addEventListener('click', () => {
      this.events.emit('payment:online');
    });

    this.getButton.addEventListener('click', () => {
      this.events.emit('payment:get');
    });

    this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { value });
		});
  }

  set value(value: string) {
    this.inputField.value = value;
  }

  set inputError(value: string) {
    this.setText(this.error, value);
  }

  set completedOnlineButton(value: boolean) {
    this.toggleClass(this.onlineButton, 'button_alt-active', value);
    this.toggleClass(this.getButton, 'button_alt-active', !value);
  }

  set completedOnfootButton(value: boolean) {
    this.toggleClass(this.onlineButton, 'button_alt-active', !value);
    this.toggleClass(this.getButton, 'button_alt-active', value);
  }

  set selected(value: boolean) {
    if (value) {
      this.setDisabled(this.submitButton, false);
    } else {
      this.setDisabled(this.submitButton, true);
    }
  }
}

export class ContactsView extends Component<IOrder> {
  protected emailInputField: HTMLInputElement;
  protected phoneInputField: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected error: HTMLElement;
  protected formName: string;

  constructor(container: HTMLFormElement, protected events: EventEmitter) {
    super(container);
    this.emailInputField = this.container.querySelector('.input_email') as HTMLInputElement;
    this.phoneInputField = this.container.querySelector('.input_phone') as HTMLInputElement;
    this.submitButton = this.container.querySelector('.button_pay') as HTMLButtonElement;
    this.error = this.container.querySelector('.form__errors') as HTMLElement;
    this.formName = this.container.getAttribute('name');

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });

    this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
  }

  set emailValue(value: string) {
    this.emailInputField.value = value;
  }

  get emailValue() {
    return this.emailInputField.value;
  }

  set phoneValue(value: string) {
    this.phoneInputField.value = value;
  }

  get phoneValue() {
    return this.phoneInputField.value;
  }

  set inputError(value: string) {
    this.setText(this.error, value);
  }

  get inputError() {
    return this.error.textContent;
  }

  set selected(value: boolean) {
    if (value) {
      this.setDisabled(this.submitButton, false);
    } else {
      this.setDisabled(this.submitButton, true);
    }
  }
}