/**
 * Базовый компонент
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
        // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
    }

    // Инструментарий для работы с DOM в дочерних компонентах

    // Переключить класс
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Сменить статус блокировки
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Установить изображение с алтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Установить цвет
    protected setColor(element: HTMLElement, value: unknown) {
        switch (value) {
            case 'софт-скил':
                element.classList.add('card__category_soft');
                break;
            case 'другое':
                element.classList.add('card__category_other');
                break;
            case 'дополнительное':
                element.classList.add('card__category_additional');
                break;
            case 'кнопка':
                element.classList.add('card__category_button');
                break;
            case 'хард-скил':
                element.classList.add('card__category_hard');
                break;
        }
    }

    // Удалить цвет
    protected removeColor(element: HTMLElement, value: boolean) {
        if (value) {
            element.classList.remove(
                'card__category_soft',
                'card__category_other',
                'card__category_additional',
                'card__category_button',
                'card__category_hard'
            );
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
