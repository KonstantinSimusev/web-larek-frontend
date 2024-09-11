import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Form<T> extends Component<T> {
    protected formName: string;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.formName = this.container.getAttribute('name');

        this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`${this.formName}:input`, { field, value });
		});
    }

}