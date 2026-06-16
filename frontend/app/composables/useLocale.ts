import { ref } from 'vue';

const currentLocale = ref<'uk' | 'en'>('uk');

// On client side, initialize from localStorage if available
if (import.meta.client) {
  const saved = localStorage.getItem('user-locale');
  if (saved === 'uk' || saved === 'en') {
    currentLocale.value = saved;
  }
}

export const translations = {
  uk: {
    home: 'Головна',
    shop: 'Магазин',
    about: 'Про нас',
    cart: 'Кошик',
    checkout: 'Оформлення замовлення',
    adminPanel: 'Адмін-панель',
    searchPlaceholder: 'Пошук товарів...',
    support: 'Підтримка дзвінків:',
    categoriesTitle: 'Категорії товарів',
    allCategories: 'Усі категорії',
    wishlist: 'Обране',
    total: 'Всього',
    addToCart: 'В кошик',
    cartEmpty: 'Кошик порожній',
    priceFilter: 'Фільтр за ціною',
    brandFilter: 'Бренди',
    ramFilter: 'Оперативна пам’ять (RAM)',
    foundProducts: 'Знайдено товарів:',
    sortByDefault: 'Сортування: За замовчуванням',
    sortByPriceAsc: 'Ціна: від дешевих до дорогих',
    sortByPriceDesc: 'Ціна: від дорогих до дешевих',
    sortByNameAsc: 'Назва: А-Я',
    applyBtn: 'Застосувати',
    prev: 'Назад',
    next: 'Вперед',
    productDetails: 'Деталі товару',
    inStock: 'в наявності',
    characteristics: 'Характеристики',
    description: 'Опис',
    // Cart page
    image: 'Зображення',
    product: 'Товар',
    price: 'Ціна',
    quantity: 'Кількість',
    subtotal: 'Всього',
    remove: 'Видалити',
    clearCart: 'Очистити кошик',
    checkoutTitle: 'Дані для доставки',
    firstName: 'Ім’я',
    lastName: 'Прізвище',
    phone: 'Телефон',
    email: 'Email',
    placeOrder: 'Оформити замовлення',
    yourOrder: 'Ваше замовлення',
    city: 'Місто',
    warehouse: 'Відділення НП',
    notes: 'Примітки до замовлення (необов’язково)',
    notesPlaceholder: 'Особливі побажання до доставки або пакування',
    shipping: 'Доставка',
    freeShipping: 'Безкоштовно',
    confirmOrder: 'Підтвердити замовлення',
    placingOrder: 'Оформлення замовлення...',
    orderSuccess: 'Замовлення успішно оформлено!',
    orderSuccessText: 'Дякуємо за покупку в магазині Aivix tech. Наші менеджери зв’яжуться з вами найближчим часом для підтвердження.',
    continueShopping: 'Продовжити покупки',
    cartEmptyDesc: 'Для оформлення замовлення додайте хоча б один товар у кошик.',
    toCatalog: 'До каталогу товарів',
    currency: 'Грн'
  },
  en: {
    home: 'Home',
    shop: 'Shop',
    about: 'About Us',
    cart: 'Cart',
    checkout: 'Checkout',
    adminPanel: 'Admin Panel',
    searchPlaceholder: 'Search products...',
    support: 'Call support:',
    categoriesTitle: 'Product Categories',
    allCategories: 'All Categories',
    wishlist: 'Wishlist',
    total: 'Total',
    addToCart: 'Add to cart',
    cartEmpty: 'Cart is empty',
    priceFilter: 'Price filter',
    brandFilter: 'Brands',
    ramFilter: 'RAM',
    foundProducts: 'Products found:',
    sortByDefault: 'Sort: Default',
    sortByPriceAsc: 'Price: Low to High',
    sortByPriceDesc: 'Price: High to Low',
    sortByNameAsc: 'Name: A-Z',
    applyBtn: 'Apply',
    prev: 'Prev',
    next: 'Next',
    productDetails: 'Product Details',
    inStock: 'in stock',
    characteristics: 'Specifications',
    description: 'Description',
    // Cart page
    image: 'Image',
    product: 'Product',
    price: 'Price',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    remove: 'Remove',
    clearCart: 'Clear Cart',
    checkoutTitle: 'Delivery Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    email: 'Email',
    placeOrder: 'Place Order',
    yourOrder: 'Your Order',
    city: 'City',
    warehouse: 'Nova Poshta Warehouse',
    notes: 'Order notes (optional)',
    notesPlaceholder: 'Special notes for delivery or packaging',
    shipping: 'Shipping',
    freeShipping: 'Free Shipping',
    confirmOrder: 'Confirm Order',
    placingOrder: 'Placing Order...',
    orderSuccess: 'Order placed successfully!',
    orderSuccessText: 'Thank you for your purchase at Aivix tech. Our managers will contact you shortly to confirm.',
    continueShopping: 'Continue Shopping',
    cartEmptyDesc: 'To place an order, please add at least one product to the cart.',
    toCatalog: 'To Catalog',
    currency: 'Uah'
  }
};

export function useLocale() {
  const setLocale = (locale: 'uk' | 'en') => {
    currentLocale.value = locale;
    if (import.meta.client) {
      localStorage.setItem('user-locale', locale);
    }
  };

  const t = (key: keyof typeof translations['uk']) => {
    return translations[currentLocale.value][key] || translations['uk'][key] || key;
  };

  return {
    locale: currentLocale,
    setLocale,
    t
  };
}
