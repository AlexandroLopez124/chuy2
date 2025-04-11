import { collection, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, Loader } from '../../components';
import { db } from '../../config/firebase.config';
import { useUserContext } from '../../context/User/UserContext';
import { IProducts } from '../../types/productsType';
import './ProfileOrder.css';
// @ts-ignore
import JsBarcode from 'jsbarcode';

const ProfileOrder: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const {
    state: { user },
  } = useUserContext();

  useEffect(() => {
    setLoading(true);
    (async () => {
      const ordersData: any[] = [];
      const userRef = doc(db, 'users', user.uid);
      const purchusesQueryRef = query(collection(db, 'purchuses'), where('userRef', '==', userRef));
      const querySnapShot = await getDocs(purchusesQueryRef);
      querySnapShot.forEach((chunk) => {
        const orderData = chunk.data();
        ordersData.push(orderData);
      });
      setOrders(ordersData);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading && orders.length > 0) {
      orders.forEach((order, index) => {
        const barcodeId = `barcode-${index}`;
        const element = document.getElementById(barcodeId);
        if (element && order.orderId) {
          JsBarcode(`#${barcodeId}`, order.orderId, {
            format: 'CODE128',
            lineColor: '#000',
            width: 2,
            height: 40,
            displayValue: true,
          });
        }
      });
    }
  }, [loading, orders]);

  const getOrderStatus = (status: any) => {
    if (status === 'true' || status === true) {
      return 'delivered';
    } else if (status === 'false' || status === false) {
      return 'pending';
    } else {
      console.error('Status inválido:', status);
      return 'pending';
    }
  };

  return (
    <div className='order-page'>
      <h2 className='order-page__title'>Mis pedidos</h2>
      {loading ? (
        <Loader />
      ) : (
        orders.length <= 0 && <h2 className='order-page__no-order'>No hay nada, No tienes ningún pedido aún</h2>
      )}
      <div className='order-page__orders'>
        {orders.map((order: any, i) => (
          <div key={i} className='order-page__orders__order'>
            <div className='order-page__orders__head'>
              <div>
                <h4 className='order-page__orders__order-id'>{order.orderId}</h4>
                <svg id={`barcode-${i}`}></svg>
                <h4 className='order-page__orders__order-date'>{order.timeStamp.toDate().toDateString()}</h4>
                <span className={`order-page__orders__status ${getOrderStatus(order.status)}`}>
                  {getOrderStatus(order.status) === 'delivered' ? 'Entregado' : 'Pendiente'}
                </span>
              </div>
              <div>
                <h4 className='order-page__orders__order-price'>${parseFloat(order.totalPrice).toFixed(2)}</h4>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              {expandedIndex === i ? (
                <div className='order-page__orders__expanded order-page__orders__expanded--spaced'>
                  {order.products.map((product: IProducts, j: number) => (
                    <div key={j} className='order-page__orders__expanded-item'>
                      <img
                        className='order-page__orders__order-img'
                        src={product.imageUrls[0]}
                        alt={product.name}
                      />
                      <p>
                        {product.name} - Talla: {product.selectedSize || 'N/A'} - Unidades: {product.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='order-page__orders__order-products'>
                  {order.products.slice(0, 4).map((product: IProducts, j: number) => (
                    <img
                      key={j}
                      className='order-page__orders__order-img'
                      src={product.imageUrls[0]}
                      alt={product.name}
                    />
                  ))}
                  {order.products.length > 4 && (
                    <span className='order-page__orders__length'>+ {order.products.length - 4}</span>
                  )}
                </div>
              )}
            </div>

            <Button
              className='secoundry order-page__orders-button'
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              {'>'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileOrder;
