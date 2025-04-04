import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { IProducts } from '../../types/productsType';
import { Button, Loader, ProductCard } from '../../components';
import './NewProduct.css';
import { useNavigate } from 'react-router-dom';

const NewProduct: React.FC = () => {
  const [products, setProducts] = useState<IProducts[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    // fetch and get product
    const allProducts: any[] = [];
    (async () => {
      const querySnap = query(collection(db, 'products'), limit(6));
      const snapShot = await getDocs(querySnap);
      snapShot.forEach((doc) => {
        const data = doc.data();
        allProducts.push({ ...data, id: doc.id });
      });
      setProducts(allProducts);
      setLoading(false);
    })();
  }, []);

  return (
    <div className='new-product'>
      <div className='new-product__head-title'>
        <span className='head-title__notic'>Rapidito que se  terminan</span>
        <h2 className='head-title__main'>Nuevos productos</h2>
      </div>
      {loading && <Loader />}
      <div className='new-product__wrapper'>
        {products.map((product) => (
          <ProductCard key={product.id} productData={product} />
        ))}
      </div>
      <div className='new-product__button-wrapper'>
        <Button onClick={() => navigate('/shop')}>Ir a la tienda</Button>
      </div>
    </div>
  );
};

export default NewProduct;
