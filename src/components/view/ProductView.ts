import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { TCatalogProduct, TPreviewProduct  } from "../../types";

export class ProductCatalogView extends Component<TCatalogProduct> {
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _id: string;

  constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

    this._category = ensureElement('.card__category', this.container) as HTMLElement;
    this._title = ensureElement('.card__title', this.container) as HTMLElement;
    this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
    this._price = ensureElement('.card__price', this.container) as HTMLElement;

    this.container.addEventListener('click', () => {
      this.events.emit('item:select', {id: this._id});
    });
  }

  set category(value: string) {
    this.setText(this._category, value);
    this.setColor(this._category, value);
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(src: string) {
    this.setImage(this._image, src, this.title);
  }

  set price(value: number) {
    if (value === null) this.setText(this._price, `Бесценно`);
    else this.setText(this._price, `${value} синапсов`);
  }

  set id(value: string) {
    this._id = value;
  }
}

export class ProductPreviewView extends Component<TPreviewProduct> {
  protected _category: HTMLElement;
  protected _title: HTMLElement;
  protected _description: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _id: string;
  protected _addButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

    this._category = ensureElement('.card__category', this.container) as HTMLElement;
    this._title = ensureElement('.card__title', this.container) as HTMLElement;
    this._description = ensureElement('.card__text', this.container) as HTMLElement;
    this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
    this._price = ensureElement('.card__price', this.container) as HTMLElement;
    this._addButton = ensureElement('.button_add', this.container) as HTMLButtonElement;

    this._addButton.addEventListener('click', () => {
      this.events.emit('basket:add', {id: this._id});
    });
  }

  set category(value: string) {
    this.setText(this._category, value);
    this.setColor(this._category, value);
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set image(src: string) {
    this.setImage(this._image, src, this.title);
  }

  set price(value: number) {
    if (value === null) this.setText(this._price, `Бесценно`);
    else this.setText(this._price, `${value} синапсов`);
  }

  set id(value: string) {
    this._id = value;
  }

  set button(value: string) {
    this.setText(this._addButton, value);
  }

  set isAdded(value: boolean) {
    if (value) {
      this.setDisabled(this._addButton, true);
      this.setText(this._addButton, 'Товар в корзине');
    }
    else this.setText(this._addButton, 'В корзину');
  }

  set selected(isPriceless: boolean) {
    if (isPriceless) {
      this.setDisabled(this._addButton, false);
      this.setText(this._addButton, 'В корзину');
    } else {
      this.setDisabled(this._addButton, true);
      this.setText(this._addButton, 'Товар не доступен');
    }
  }
  
  set deleteColor(value: boolean) {
    this.removeColor(this._category, value);
  }
}

export interface IProductBasketView {
  id: string;
  index: number;
  title: string;
  price: number;
}

export class ProductBasketView extends Component<IProductBasketView> {
  protected _id: string;
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

    this._index = ensureElement('.basket__item-index', this.container) as HTMLElement;
    this._title = ensureElement('.card__title', this.container) as HTMLElement;
    this._price = ensureElement('.card__price', this.container) as HTMLElement;
    this._deleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;

    this._deleteButton.addEventListener('click', () => {
      this.events.emit('basket:delete', {id: this._id});
    });
  }

  set id(value: string) {
    this._id = value;
  }

  set index(value: number) {
    this.setText(this._index, value);
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number) {
    if (value === null) this.setText(this._price, `Бесценно`);
    else this.setText(this._price, `${value} синапсов`);
  }
}