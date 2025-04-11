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
  const [showConfirm, setShowConfirm] = useState(false);

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

  const markAsDelivered = () => {
    setShowConfirm(true)
  };

  const handleConfirm = async () => {
    if (!foundOrder) return;
      try {
        const orderRef = doc(db, 'purchuses', foundOrder.id);
        await updateDoc(orderRef, { status: true });
        setFoundOrder({ ...foundOrder, status: true });
      } catch (err) {
        console.error('Error updating order:', err);
      }
    
    setShowConfirm(false);
  }

  return (
    <div className='admin-order2'>
      <h2 className='admin-order__title'>Confirmar Entregas</h2>

      <div className='admin-order__search'>
        <input
          type='text'
          placeholder='Buscar por orderId'
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading && <p className='admin-order__loading'>Cargando...</p>}

      {foundOrder && (
        <div className='admin-order__result'>
          <h3 className='admin-order__subtitle'>Pedido encontrado:</h3>
          <p className='order-info-p'><strong>orderId:</strong> {foundOrder.orderId}</p>
          <p className='order-info-p'><strong>Estado:</strong> {foundOrder.status ? 'Entregado ✅' : 'No entregado ❌'}</p>

          <div className='admin-order__products'>
            {foundOrder.products.map((product: any, i: number) => (
              <div key={i} className='admin-order__product'>
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                />
                <p >{product.name}</p>
                <p >Talla: {product.selectedSize || 'N/A'}</p>
                <p >Cantidad: {product.quantity}</p>
              </div>
            ))}
          </div>

          {!foundOrder.status && !showConfirm &&(
            <div className='admin-order__button-wrapper'>
              <button className='admin-order__confirm' onClick={markAsDelivered}>
                Marcar como entregado
              </button>
            </div>
          )}

          {showConfirm && (
          <div className="admin-order__confirmation">
            <p className="admin-order__confirmation-p">¿Estás seguro de que deseas marcar este pedido como entregado?</p>
            <button className="admin-order__confirmation-confirm" onClick={handleConfirm}>Sí</button>
            <button className="admin-order__confirmation-cancel" onClick={() => setShowConfirm(false)}>Cancelar</button>
          </div>
          )}
        </div>
      )}


    </div>
  );
};

export default AdminOrder;

