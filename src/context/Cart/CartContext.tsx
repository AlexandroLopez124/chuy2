import React, { createContext, Reducer, useContext, useEffect, useReducer } from 'react';
import useLocalStorage from '../../hook/useLocalStorage';
import { ICart, IProducts } from '../../types/productsType';
import cartReducer from './CartReducer';
import coponData from '../../data/copon.json';

const initialState: ICart = {
  totalPrice: 0,
  products: [],
};
const CartContext = createContext<any>(initialState);

interface IProps {
  children: React.ReactNode;
}
const CartContextProvider: React.FC<IProps> = ({ children }) => {
  const [state, dispath] = useReducer<Reducer<ICart, any>>(cartReducer, initialState);
  const { getStorage, setStorage } = useLocalStorage();

  const addToCart = (productData: IProducts, quantity: number = 1): void => {
    const { products } = state;
  
    // Buscar si ya existe el mismo producto con la misma talla
    const existingProduct = products.find(
      (product) => product.id === productData.id && product.selectedSize === productData.selectedSize
    );
  
    if (existingProduct) {
      // Si ya existe esa talla, aumentar cantidad
      existingProduct.quantity += quantity;
  
      // Reemplazar el producto existente por el actualizado
      const updatedProducts = products.map((p) =>
        p.id === existingProduct.id && p.selectedSize === existingProduct.selectedSize ? existingProduct : p
      );
  
      setStorage('SHOP_CART', updatedProducts);
      dispath({ type: 'SET_CART', payload: updatedProducts });
    } else {
      // Si no existe esa combinación, agregarlo como nuevo
      productData.quantity = quantity;
  
      if (!productData.id) return;
  
      const cartData = getStorage('SHOP_CART');
      const updatedCart = [...products, productData];
  
      setStorage('SHOP_CART', updatedCart);
      dispath({ type: 'ADD_TO_CART', payload: updatedCart });
    }
  };

  const deleteFromCart = (item: IProducts): void => {
    const filtered = state.products.filter(
      (product) => !(product.id === item.id && product.selectedSize === item.selectedSize)
    );
    setStorage('SHOP_CART', filtered);
    dispath({ type: 'SET_CART', payload: filtered });
  };

  const increaseQuantity = (item: IProducts): void => {
    const updated = state.products.map((product) => {
      if (product.id === item.id && product.selectedSize === item.selectedSize) {
        return { ...product, quantity: product.quantity + 1 };
      }
      return product;
    });
    setStorage('SHOP_CART', updated);
    dispath({ type: 'SET_CART', payload: updated });
  };

  const decreaseQuantity = (item: IProducts): void => {
    const updated = state.products
      .map((product) => {
        if (product.id === item.id && product.selectedSize === item.selectedSize) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      })
      .filter((product) => product.quantity > 0);
      
    setStorage('SHOP_CART', updated);
    dispath({ type: 'SET_CART', payload: updated });
  };

  const clearCart = () => {
    dispath({ type: 'CLEAR_CART' });
    setStorage('SHOP_CART', []);
  };
  const setTotalPrice = (price: number): void => {
    dispath({ type: 'SET_TOTAL_PRICE', payload: price });
  };
  useEffect(() => {
    const localCopon = getStorage('DISCOUNT_COPON');
    let totalPrice: any = state.products
      .reduce((prev, item) => (prev += (item.price - (item.price * item.discountPercent) / 100) * item.quantity), 0)
      .toFixed(2);
    if (localCopon.percent > 0) {
      for (const cop in coponData) {
        if (cop === localCopon.text) {
          const discount: any = ((totalPrice * localCopon.percent) / 100).toFixed(2);
          totalPrice = (+totalPrice - +discount).toFixed(2);
        }
      }
    }
    setTotalPrice(totalPrice);
  }, [state.products]);

  return (
    <CartContext.Provider
      value={{
        cart: state.products,
        totalPrice: state.totalPrice,
        dispath,
        clearCart,
        addToCart,
        deleteFromCart,
        increaseQuantity,
        decreaseQuantity,
        setTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

interface IReducer {
  cart: IProducts[];
  totalPrice: number;
  dispath: ({ type, payload }: { type: string; payload: any }) => void;
  addToCart: (productData: IProducts, quantity: number) => void;
  deleteFromCart: (item: IProducts) => void;
  increaseQuantity: (item: IProducts) => void;
  decreaseQuantity: (item: IProducts) => void;
  setTotalPrice: (price: number) => void;
  clearCart: () => void;
}
const useCartContext = (): IReducer => useContext(CartContext);

export default CartContext;
export { CartContextProvider, useCartContext };
