import { FC, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { useCartContext } from '../../context/Cart/CartContext';
import { useUserContext } from '../../context/User/UserContext';
import useAuth from '../../hook/useAuth';
import useToast from '../../hook/useToast';
import { Container } from '../../Layout';
import { db } from '../../config/firebase.config';
import useLocalStorage from '../../hook/useLocalStorage';
import { useLoader } from '../../context/Loader/LoaderContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './CheckOut.css';

const stripePromise = loadStripe('pk_test_51P2PCqLOoj4xj39ToufxgpExh9oR33230bXeU3c16AHA0Zt9rCa2BtaJOPjUl91B1dkwTkqfhF8ECXGzN2OjWFUN00yeRGCIRX');

const CheckOutForm: FC = () => {
  const { cart, totalPrice, clearCart } = useCartContext();
  const { user } = useUserContext().state;
  const { setStorage } = useLocalStorage();
  const { setLoader } = useLoader();
  const navigate = useNavigate();
  const { errorToast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const handleOrder = async () => {
    if (!stripe || !elements) return;
  
    setLoader(true);
    
    try {
      // 1. Solicitar al backend el PaymentIntent
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalPrice }), 
      });
  
      const { clientSecret } = await response.json();
  
      // 2. Confirmar el pago con Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: user.displayName || 'Cliente',
            email: user.email || '',
          },
        },
      });
  
      if (error) throw error;
  
      // 3. Guardar en Firestore
      const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      await setDoc(doc(db, 'purchuses', orderId), {
        orderId,
        products: cart,
        totalPrice,
        timeStamp: Timestamp.now(),
        userRef: doc(db, 'users', user.uid),
        paymentIntentId: paymentIntent.id,
        status: false,  // Agregamos el campo status como booleano y lo establecemos en false
      });
  
      // 4. Limpiar el carrito y redirigir
      clearCart();
      setStorage('DISCOUNT_COPON', { text: '', percent: 0 });
      navigate('/thanks', { state: { inApp: true, orderId } });
    } catch (error) {
      const e = error as Error;
      errorToast('Error en el pago', e.message || 'Inténtalo de nuevo');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__left">
        <h3 className="checkout__left__title">Método de pago</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleOrder(); }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          <Button type="submit" disabled={!stripe} className="checkout__left__inputs__button">
            Pagar ${totalPrice}
          </Button>
        </form>
      </div>

      {/* --- RESUMEN DEL PEDIDO --- */}
      <div className="checkout__right">
        <h4 className="checkout__right__title">Resumen del pedido</h4>
        <div className="checkout__right__box">
          <div className="checkout__right__box__products">
            {cart.map((product, i) => (
              <div key={i} className="checkout__right__product">
                <img 
                  className="checkout__right__product-image" 
                  src={product.imageUrls[0]} 
                  alt={product.name} 
                />
                <div className="checkout__right__product__ditails">
                  <h4 className="checkout__right__product__name">
                    {product.name.length >= 32 
                      ? `${product.name.slice(0, 35)}...` 
                      : product.name}
                  </h4>
                  <h5 className="checkout__right__product__price">
                    ${(product.price - (product.price * product.discountPercent) / 100).toFixed(2)}
                  </h5>
                </div>
                <h5 className="checkout__right__product__quantity">{product.quantity}</h5>
              </div>
            ))}
          </div>
          <hr className="checkout__right__line" />
          <h4 className="checkout__right__subtotal">
            Subtotal ({cart.reduce((prev, product) => prev + product.quantity, 0)} items)
          </h4>
          <h4 className="checkout__right__totalPrice">
            Total: ${totalPrice}
          </h4>
        </div>
      </div>
    </div>
  );
};

const CheckOut: FC = () => {
  const { isAuth, loading } = useAuth();
  const { errorToast } = useToast();

  useEffect(() => {
    if (!loading && !isAuth) {
      errorToast('No estás autenticado', 'Inicia sesión para continuar');
    }
  }, [loading, isAuth]);

  return (
    <Container>
      <h2 className="checkout__title">Verificar compra</h2>
      <Elements stripe={stripePromise}>
        <CheckOutForm />
      </Elements>
    </Container>
  );
};

export default CheckOut;