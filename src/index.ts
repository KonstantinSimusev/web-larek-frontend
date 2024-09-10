import './scss/styles.scss';

import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/events";
import { ProductAPI } from './components/ProductAPI';
import { ProductModel } from "./components/model/ProductModel";
import { OrderModel } from "./components/model/OrderModel";
import { PageView } from "./components/view/PageView";
import { ModalView } from "./components/view/ModalView";
import { BasketView } from './components/view/BasketView';
import { OrderView } from "./components/view/FormView";
import { ContactsView } from "./components/view/FormView";
import { SuccessView } from './components/view/SuccessView';
import { 
  ProductCatalogView,
  ProductPreviewView,
  ProductBasketView 
} from "./components/view/ProductView";

const api = new ProductAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Экземпляры моделей
const productModel = new ProductModel(events);
const orderModel = new OrderModel(events);

// Экземпляр класса модального окна
const modal = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);

// Экземпляр класса главной страницы
const page = new PageView(ensureElement<HTMLElement>('.page__wrapper'), events);

// Темплейты проекта
const catalogProductTemplate = ensureElement<HTMLElement>('#card-catalog') as HTMLTemplateElement;
const previewProductTemplate = ensureElement<HTMLElement>('#card-preview') as HTMLTemplateElement;
const basketTemplate = ensureElement<HTMLElement>('#basket') as HTMLTemplateElement;
const basketProductTemplate = ensureElement<HTMLElement>('#card-basket') as HTMLTemplateElement;
const orderTemplate = ensureElement<HTMLElement>('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement<HTMLElement>('#contacts') as HTMLTemplateElement;
const payTemplate = ensureElement<HTMLElement>('#success') as HTMLTemplateElement;

// Экземпляры классов представления
const preview = new ProductPreviewView(cloneTemplate(previewProductTemplate), events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const order = new OrderView(cloneTemplate(orderTemplate), events);
const contacts = new ContactsView(cloneTemplate(contactsTemplate), events);
const pay = new SuccessView(cloneTemplate(payTemplate), events);

// Получить список товаров с сервера
api.getProductList()
  .then(data => {
    productModel.catalog = data;

    page.render({
      counter: productModel.count,
      catalog: productModel.catalog.map(item => 
        new ProductCatalogView(cloneTemplate(catalogProductTemplate), events)
        .render(item))
    });
  })
    .catch(err => console.log(err));

// Отследить изменения в проекте
events.on('items:changed', () => {
  page.counter = productModel.basket.length;
  basket.selected = productModel.basket;
});

// Выбрать товар
events.on('item:select', ({id}: {id: string}) => {
  const item = productModel.getItem(id);
  preview.selected = productModel.isPriceless(item);

  if (productModel.isToBasket(id)) preview.isAdded = true;
  
  modal.render({
    content: preview.render(item)
  });
});

// Добавить товар в корзину
events.on('basket:add', ({id}: {id: string}) => {
  const item = productModel.getItem(id);
  productModel.addToBasket(item);

  if (productModel.isToBasket(id)) preview.isAdded = true;

  page.counter = productModel.basket.length;
});

// Открыть корзину
events.on('basket:open', () => {
  basket.selected = productModel.basket;

  modal.render({
    content: basket.render({
      items: productModel.basket.map((item, index) => 
        new ProductBasketView(cloneTemplate(basketProductTemplate), events).render({
          id: item.id,
          index: index + 1,
          title: item.title,
          price: item.price
        })),
      total: productModel.total,
    })
  });
});

// Удалить товар из корзины
events.on('basket:delete', ({id}: {id: string}) => {
  productModel.deleteFromBasket(id);
  
  modal.render({
    content: basket.render({
      items: productModel.basket.map((item, index) => 
        new ProductBasketView(cloneTemplate(basketProductTemplate), events).render({
          id: item.id,
          index: index + 1,
          title: item.title,
          price: item.price
        })),
      total: productModel.total,
    })
  });
})

// Открыть форму заказа для заполнения адреса
events.on('order:open', () => {
  order.completedOnlineButton = true;
  orderModel.payment = 'online';
  modal.render({content: order.render()});
});

// Выбрать оплату "Онлайн"
events.on('payment:online', () => {
  order.completedOnlineButton = true;
  orderModel.payment = '';
  orderModel.payment = 'online';
});

// Выбрать оплату "При получении"
events.on('payment:get', () => {
  order.completedOnfootButton = true;
  orderModel.payment = '';
  orderModel.payment = 'onfoot';
});

// Валидация поля с адресом
events.on('order:input', ({ value } : { value: string }) => {
  if (value.length < 3) {
    order.inputError = 'Необходимо указать не менее 3 символов';
    order.selected = false;
  } else {
    order.inputError = '';
    order.selected = true;
  }
})

// Открыть форму заказа для заполнения почты и телефона
events.on('forward:submit', ({ value } : { value: string }) => {
  orderModel.address = value;
  modal.render({content: contacts.render()});
});

// Валидация полей почты и телефона
events.on('contacts:input', ({ field, value } : { field: string, value: string }) => {
  if (field === 'email' && value.length < 5 || field === 'email' && !value.includes('@')) {
    contacts.inputError = 'Необходимо указать не менее 5 символов и знак @';
    contacts.selected = false;
  } else if (field === 'phone' && !Number(value) || field === 'phone' && value.length < 8) {
    contacts.inputError = 'Необходимо указать не менее 8 цифр';
    contacts.selected = false;
  } else contacts.inputError = '';

  if (field === 'email') orderModel.email = value;
  if (field === 'phone') orderModel.phone = value;

  if (!orderModel.email.length || !orderModel.phone.length || contacts.inputError.length) contacts.selected = false;
  else contacts.selected = true;

})

// Оплатить заказ
events.on('order:submit', () => {
  api.addOrder({
    payment: orderModel.payment,
    address: orderModel.address,
    email: orderModel.email,
    phone: orderModel.phone,
    total: productModel.total,
    items: productModel.basketItemsId
  })
    .then(data => {
      pay.description = data.total;
      modal.render({content: pay.render()});
      productModel.clearBasket();
      page.counter = productModel.basket.length;
      order.value = '';
      contacts.emailValue = '';
      contacts.phoneValue = '';
      order.completedOnlineButton = true;
      order.selected = false;
    })
    .catch(err => console.log(err));
});

// Закрыть модальное окно после успешной транзакции
events.on('order:close', () => {
  modal.close();
});

// Блокируем прокрутку страницы, если модальное окно открыто
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокируем прокрутку страницы, если модальное окно закрыто
events.on('modal:close', () => {
  page.locked = false;
});
