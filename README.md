# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
interface IProduct {
  id: string;
  category: string;
  title: string;
  image: string;
  description: string;
  price: number | null;
}
```

Заказ

```
interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: string[];
}
```

Типы товаров

```
type TCatalogProduct = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>
type TPreviewProduct = Pick<IProduct, 'category' | 'title' | 'image' | 'price' | 'description'>
```
## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

### Слой данных

#### Класс ProductModel
Класс отвечает за хранение и логику работы с данными товара.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- protected catalogItems: IProduct[] - массив товаров
- protected basketItems: IProduct[] = [] - массив товаров в корзине

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- set catalog(items: IProduct[]) {} - устанавливает товары на главную страницу
- get catalog() {} - возвращает товары
- get count() {} - возвращает число товаров в корзине
- get total() {} - возвращает сумму товаров в корзине
- get basket() {} - возвращает массив товаров в карзине
- get basketItemsId() {} - возвращает массив id товаров
- getItem(id: string): IProductItem {} - возвращает один товар
- isToBasket(id: string): boolean {} - проверяет наличие товара в корзине
- clearBasket(): IProduct[] {} - очищает корзину
- addToBasket(item: IProductItem) {} - добавляет товар в корзину
- deleteFromBasket(id: string) {} - удаляет товар из корзины
- isPriceless(item: IProduct) {} - проверяет бесценный товар

#### Класс OrderModel
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий\
Поле класса хранит объект:
- protected order: IOrder = {
    payment: '',    - вид оплаты
    address: '',    - адрес электронной почты
    email: '',      - номер телефона
    phone: '',      - адрес доставки
    total: 0,       - сумма заказа
    items: []       - массив id товаров
  };

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- set payment(value: string) {} - устанавливает вид оплаты
- get payment() {} - возвращает вид оплаты
- set address(value: string) {} - устанавливает адрес
- get address() {} - возвращает адрес
- set email(value: string) {} - устанавливает почту
- get email() {} - возвращает почту
- set phone(value: string) {} - устанавливает телефон 
- get phone() {} - возвращает телефон

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ModalView
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий

#### Класс class ProductView
Предназначен для отображения карточки товара на главной странице.\
Поля класса:
- protected _category: HTMLElement - категория товара
- protected _title: HTMLElement - название товара
- protected _image: HTMLImageElement - изображение товара
- protected _price: HTMLElement - цена товара
- protected _id: string - идентификатор товара

- constructor(protected container: HTMLElement, protected events: IEvents) - конструктор принимает контейнер для товара и экземпляр класса `EventEmitter` для инициации событий, создает слушатель события

Методы:
Устанавливают значения
- set category(value: string) {}
- set title(value: string) {}
- set image(src: string) {}
- set price(value: number) {}
- set id(value: string) {}

#### Класс class PreviewView
Предназначен для отображения карточки товара на главной странице.\
Поля класса:
- protected _category: HTMLElement - категория товара
- protected _title: HTMLElement - название товара
- protected _image: HTMLImageElement - изображение товара
- protected _price: HTMLElement - цена товара
- protected _description: HTMLElement - описание товара
- protected _id: string - идентификатор товара

- constructor(protected container: HTMLElement, protected events: IEvents) - конструктор принимает контейнер для товара и экземпляр класса `EventEmitter` для инициации событий, создает слушатель события

Методы:
Устанавливают значения
- set category(value: string) {}
- set title(value: string) {}
- set image(src: string) {}
- set price(value: number) {}
- set description(value: string) {}
- set id(value: string) {}

#### Класс class PageView
Предназначен для отображения главной страницы.\
Поля класса:
- protected _counter: HTMLElement - количество товаров в корзине
- protected _catalog: HTMLElement - контейнер с карточками товара
- protected _wrapper: HTMLElement - конейнер страницы
- protected _basket: HTMLElement - корзина 

- constructor(protected container: HTMLElement, protected events: IEvents) - конструктор принимает контейнер для товара и экземпляр класса `EventEmitter` для инициации событий, создает слушатель события

Методы:
- set counter(value: number) {} устанавливает количество товаров в корзине
- set catalog(items: HTMLElement[]) {} отображает контейнер с товарами

#### Класс BasketView
Предназначен для отображения корзины с товарами.\
Поля класса:
- protected title: HTMLElement - название корзины
- protected _basketItems: HTMLElement - массив товаров
- protected _total: HTMLElement - общая цена
- protected orderButton: HTMLElement - кнопка офрмления заказа

Методы:
- set basketItems(items: HTMLElement[]) {} - устанавливает массив с товарами
- set total(value: string) {} - устанавливает суммму заказа

#### Класс BasketProductView
Предназначен для отображения товара в корзине.\
Поля класса:
- protected _index: HTMLElement - номер по порядку
- protected _title: HTMLElement - назавние товара
- protected _total: HTMLElement - цена товара
- protected _deleteButton: HTMLElement - кнопка удаления товара

- constructor(protected container: HTMLElement, protected events: IEvents) - конструктор принимает контейнер для товара и экземпляр класса `EventEmitter` для инициации событий, создает слушатель события

Методы:
- set title(value: string) {} - устанавливает название
- set total(value: number) {} - устанавливает

#### Класс AddressOrderView
Предназначен для отображения формы с адрессом.\
Поля класса:
- protected payment: HTMLElement[] - кнопки c видом оплаты
- protected input: HTMLInputElement - поле с адрессом
- protected _form: HTMLFormElement - форма
- protected errors: Record<string, HTMLElement> - ошибка при заполнении формы
- protected submitButton: HTMLButtonElement - кнопка далее

- constructor(protected container: HTMLElement, protected events: IEvents) - конструктор принимает контейнер для товара и экземпляр класса `EventEmitter` для инициации событий, создает слушатель события

Методы:
- set inputValues(data: Record<string, string>) {} - установить значение
- set error(data: { field: string; value: string; validInformation: string }) {} - установить ошибку
- set valid(isValid: boolean) {} - установить валидность
- get form() {} - получить форму
- getInputValues() {} - получить значение поля
- showInputError(field: string, errorMessage: string) {} - показать ошибку
- hideInputError(field: string) {} - скрыть ошибку
- clear() {} - очистить форму

#### Класс ContactsOrderView
Предназначен для отображения формы с контактами.\
Поля класса:
- protected payment: HTMLElement[] - кнопки c видом оплаты
- protected emailInput: HTMLInputElement - поле с адрессом почты
- protected contactsInput: HTMLInputElement - поле с номером телефона
- protected _form: HTMLFormElement - форма
- protected errors: Record<string, HTMLElement> - ошибка при заполнении формы
- protected submitButton: HTMLButtonElement - кнопка далее

- constructor(protected container: HTMLElement, protected events: IEvents) - конструктор принимает контейнер для товара и экземпляр класса `EventEmitter` для инициации событий, создает слушатель события

Методы:
- set emailInputValues(data: Record<string, string>) {} - установить значение почты
- set contanctsInputValues(data: Record<string, string>) {} - установить значение телефона
- set error(data: { field: string; value: string; validInformation: string }) {} - установить ошибку
- set valid(isValid: boolean) {} - установить валидность
- get form() {} - получить форму
- getInputValues() {} - получить значение поля
- showInputError(field: string, errorMessage: string) {} - показать ошибку
- hideInputError(field: string) {} - скрыть ошибку
- clear() {} - очистить форму

### Слой коммуникации

#### Класс ProductApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список событий, которые могут генерироваться в системе:*\
- `product:select` - открыть товар в модальном окне
- `product:add` - добавить товар в корзину
- `basket:open` - открыть корзину
- `product:delete` - выбор товара для удаления
- `product:order` - выбор заказа для оформления

- `email:input` - изменение данных в форме с почтой
- `contacts:input` - изменение данных в форме с контактами
- `address:input` - изменение данных в форме с адресом
- `oder:submit` - сохранение данных заказа
- `email:validation` - событие, сообщающее о необходимости валидации формы с почтой
- `contacts:validation` - событие, сообщающее о необходимости валидации формы с контактами
- `address:validation` - событие, сообщающее о необходимости валидации формы с адрессом
