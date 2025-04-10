import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, ShopCartItem } from '../../components';
import { useCartContext } from '../../context/Cart/CartContext';
import { Container } from '../../Layout';
import emptyCartImage from '../../assets/image/cart.png';
import useForm from '../../hook/useForm';
import coponData from '../../data/copon.json';
import useToast from '../../hook/useToast';
import useLocalStorage from '../../hook/useLocalStorage';
import './Cart.css';

const Cart: FC = () => {
  const navigate = useNavigate();
  const { cart, setTotalPrice } = useCartContext();
  const [copon, setCopon] = useState<{ text: string; percent: number }>({ text: '', percent: 0 });
  const { errorToast } = useToast();
  const { setStorage, getStorage } = useLocalStorage();

  const totalProductsPrice: any = cart
    .reduce((prev, item) => (prev += (item.price - (item.price * item.discountPercent) / 100) * item.quantity), 0)
    .toFixed(2);

  const submitToCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    }
  };

  useEffect(() => {
    // get saved token from local storage
    const localStorageCopon = getStorage('DISCOUNT_COPON');
    if (localStorageCopon.percent > 0) {
      setCopon(localStorageCopon);
      values.copon = localStorageCopon.text;
    }
  }, []);

  // refactor !
  const applyCopon = () => {
    // if we dont have any copon set,add it
    if (copon.percent <= 0) {
      for (const cop in coponData) {
        if (cop === values.copon) {
          type ObjectKey = keyof typeof coponData;
          setCopon({ text: cop, percent: coponData[cop as ObjectKey] });
          setStorage('DISCOUNT_COPON', { text: cop, percent: coponData[cop as ObjectKey] });
          const coponDiscount: any = ((totalProductsPrice * coponData[cop as ObjectKey]) / 100).toFixed(2);
          setTotalPrice(+(+totalProductsPrice - +coponDiscount).toFixed(2));
        }
      }
      if (!coponData.hasOwnProperty(values.copon)) {
        errorToast('Codigo del cupón es incorrecto', 'Intente " TEST " para obtener un 20% de descuento');
      }
    } else {
      //if we have copon , remove it
      values.copon = '';
      setCopon({ text: '', percent: 0 });
      setTotalPrice(+totalProductsPrice);
      setStorage('DISCOUNT_COPON', { text: '', percent: 0 });
    }
  };

  const { handleSubmit, handleChange, values } = useForm(applyCopon, { copon: copon.text });

  const discount: any = ((totalProductsPrice * copon.percent) / 100).toFixed(2);
  return (
    <Container>
      <h2 className='cart-page__title'>Carrito de compra</h2>
      <div className='cart-page'>
        <div className='cart-page__right'>
          <div className='cart-page__right__summery-box'>
          <h3 className='cart-page__right__summery-box__title'>Resumen</h3>
            <h4 className='cart-page__right__summery-box__order-price'>
              Pedido Total : {(totalProductsPrice - discount).toFixed(2)} $
            </h4>
            <h4 className='cart-page__right__summery-box__discount-status'>
              {copon.percent > 0 ? `${copon.percent}% discount and you save ${discount} $` : ''}
            </h4>
            <Button disabled={cart.length <= 0} onClick={submitToCheckout} className='cart-page__submit'>
              Continuar para verificar
            </Button>
          </div>
        </div>
        <div className='cart-page__left'>
          {cart.length <= 0 && (
            <>
              <img src={emptyCartImage} alt='empty cart' className='cart-page__left__empty-cart' />
              <h4 className='cart-page__left__empty-cart__title'>No hay ningun articulo en tu carrito</h4>
              <Button onClick={() => navigate('/shop')}>¡A comprar!</Button>
            </>
          )}
          <div className='cart-page__left-products'>
            {cart.map((product) => (
              <ShopCartItem key={product.id} item={product} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
