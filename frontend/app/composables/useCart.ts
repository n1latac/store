import { computed } from 'vue';

export interface CartItem {
  id: number;
  name: string;
  name_uk?: string;
  name_en?: string | null;
  price: number;
  image: string;
  quantity: number;
}

export const useCart = () => {
  const cartCookie = useCookie<CartItem[]>('shopping-cart', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const cartItems = computed(() => cartCookie.value || []);

  const cartCount = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  const addToCart = (product: { id: number; name_uk: string; name_en?: string | null; price: number | string; image_url: string }, quantity: number = 1) => {
    const items = [...cartItems.value];
    const existing = items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name_uk,
        name_uk: product.name_uk,
        name_en: product.name_en || null,
        price: Number(product.price),
        image: product.image_url,
        quantity,
      });
    }
    cartCookie.value = items;
  };

  const removeFromCart = (productId: number) => {
    cartCookie.value = cartItems.value.filter(item => item.id !== productId);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const items = [...cartItems.value];
    const existing = items.find(item => item.id === productId);
    if (existing) {
      existing.quantity = Math.max(1, quantity);
      cartCookie.value = items;
    }
  };

  const clearCart = () => {
    cartCookie.value = [];
  };

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
