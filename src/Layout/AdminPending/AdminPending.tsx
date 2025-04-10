import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../config/firebase.config';
import { Loader } from '../../components';
import { IProducts } from '../../types/productsType';
// @ts-ignore

const AdminPendingOrders: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const orders: any[] = [];
      const pendingQuery = query(
        collection(db, 'purchuses'),
        where('status', '==', false) // Solo compras pendientes
      );
      const snapshot = await getDocs(pendingQuery);
      snapshot.forEach((doc) => {
        orders.push(doc.data());
      });
      setPendingOrders(orders);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading && pendingOrders.length > 0) {
      pendingOrders.forEach((order, index) => {
        const barcodeId = `admin-barcode-${index}`;
        const element = document.getElementById(barcodeId);
      });
    }
  }, [loading, pendingOrders]);

  return (
    <div className='admin-order-page'>
      <h2 className='admin-order-page__title'>Compras Pendientes</h2>
      {loading ? (
        <Loader />
      ) : (
        pendingOrders.length === 0 ? (
          <p className='admin-order-page__no-orders'>No hay compras pendientes.</p>
        ) : (
          <div className='admin-order-page__orders'>
            {pendingOrders.map((order: any, i) => (
              <div key={i} className='admin-order-page__order'>
                <div className='admin-order-page__header'>
                  <div>
                    <h4>ID: {order.orderId}</h4>
                    <p>Fecha: {order.timeStamp.toDate().toDateString()}</p>
                  </div>
                  <div>
                    <p>Total: {order.totalPrice} $</p>
                    <span className='status-tag pending'>Pendiente</span>
                  </div>
                </div>
                <div className='admin-order-page__products'>
  {order.products.map((product: IProducts, i: number) => (
    <div key={i} className='admin-order-page__product'>
      <p className='admin-order-page__product-name'>{product.name}</p>
    </div>
  ))}
</div>

              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AdminPendingOrders;