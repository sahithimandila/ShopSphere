import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const StoreContext = createContext(); const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read('shopsphere_cart', [])); const [wishlist, setWishlist] = useState(() => read('shopsphere_wishlist', [])); const [user, setUser] = useState(() => read('shopsphere_user', null));
  useEffect(() => localStorage.setItem('shopsphere_cart', JSON.stringify(cart)), [cart]); useEffect(() => localStorage.setItem('shopsphere_wishlist', JSON.stringify(wishlist)), [wishlist]); useEffect(() => localStorage.setItem('shopsphere_user', JSON.stringify(user)), [user]);
  const addToCart = product => setCart(items => { const found = items.find(x => x.id === product.id); return found ? items.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x) : [...items, { ...product, quantity: 1 }]; });
  const value = useMemo(() => ({ cart, wishlist, user, addToCart, updateQuantity: (id, quantity) => setCart(x => x.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)), removeFromCart: id => setCart(x => x.filter(i => i.id !== id)), toggleWishlist: p => setWishlist(x => x.some(i => i.id === p.id) ? x.filter(i => i.id !== p.id) : [...x, p]), setUser, clearCart: () => setCart([]) }), [cart, wishlist, user]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
} export const useStore = () => useContext(StoreContext);
