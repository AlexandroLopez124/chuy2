import React, { useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import './AdminOrder.css';

const AdminOrder: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'purchuses'), where('orderId', '==', searchId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const orderData = snapshot.docs[0];
        setFoundOrder({ id: orderData.id, ...orderData.data() });
      } else {
        setFoundOrder(null);
      }
    } catch (err) {
      console.error('Error searching order:', err);
    }
    setLoading(false);
  };

  const markAsDelivered = async () => {
    if (!foundOrder) return;
    try {
      const orderRef = doc(db, 'purchuses', foundOrder.id);
      await updateDoc(orderRef, { status: true });
      setFoundOrder({ ...foundOrder, status: true });
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  return (
    <div className='order-page'>
      <h2 className='order-page__title'>Confirmar Entregas</h2>

      <div className='order-search'>
        <input
          type='text'
          placeholder='Buscar por orderId'
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading && <p>Cargando...</p>}

      {foundOrder && (
        <div className='order-result'>
          <h3>Pedido encontrado:</h3>
          <p><strong>orderId:</strong> {foundOrder.orderId}</p>
          <p><strong>Estado:</strong> {foundOrder.status ? 'Entregado ✅' : 'No entregado ❌'}</p>

          <div className='order-products'>
            {foundOrder.products.map((product: any, i: number) => (
              <div key={i} className='order-product'>
                <img src={product.imageUrls[0]} alt={product.name} />
                <p>{product.name}</p>
              </div>
            ))}
          </div>

          {!foundOrder.status && (
            <button className='mark-delivered' onClick={markAsDelivered}>
              Marcar como entregado
            </button>
          )}
        </div>
      )}

      {!loading && searchId && !foundOrder && <p>No se encontró ninguna orden con ese ID.</p>}
    </div>
  );
};

export default AdminOrder;