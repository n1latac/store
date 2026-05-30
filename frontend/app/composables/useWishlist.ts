import { computed } from 'vue';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const useWishlist = () => {
  const wishlistCookie = useCookie<WishlistItem[]>('wishlist', {
    default: () => [],
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  const wishlistItems = computed(() => wishlistCookie.value || []);

  const wishlistCount = computed(() => {
    return wishlistItems.value.length;
  });

  const addToWishlist = (product: { id: number; name_uk: string; price: number | string; image_url: string }) => {
    const items = [...wishlistItems.value];
    const exists = items.some(item => item.id === product.id);
    if (!exists) {
      items.push({
        id: product.id,
        name: product.name_uk,
        price: Number(product.price),
        image: product.image_url,
      });
      wishlistCookie.value = items;
    }
  };

  const removeFromWishlist = (productId: number) => {
    wishlistCookie.value = wishlistItems.value.filter(item => item.id !== productId);
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.value.some(item => item.id === productId);
  };

  const toggleWishlist = (product: { id: number; name_uk: string; price: number | string; image_url: string }) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
};
