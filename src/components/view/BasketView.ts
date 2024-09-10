import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";
import { IProduct } from "../../types";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class BasketView extends Component<IBasketView> {
    protected _title: HTMLElement;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._title = this.container.querySelector('.modal__title') as HTMLElement;
        this._list = this.container.querySelector('.basket__list') as HTMLElement;
        this._total = this.container.querySelector('.basket__price') as HTMLElement;
        this._button = this.container.querySelector('.basket__button') as HTMLElement;

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._title.textContent = 'Корзина';
        } else {
            this._list.replaceChildren(...items);
            this._title.textContent = 'Корзина пуста';
            
        }
    }

    set selected(items: IProduct[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}