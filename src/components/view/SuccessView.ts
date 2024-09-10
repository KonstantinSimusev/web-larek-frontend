import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";

interface ISuccessView {
    total: number;
}

export class SuccessView extends Component<ISuccessView> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._description = ensureElement('.order-success__description', this.container) as HTMLElement;
        this._button = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        this._button.addEventListener('click', () => {
            this.events.emit('order:close');
        });
    }

    set description(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`)
    }
}