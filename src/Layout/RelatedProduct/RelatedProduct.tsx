import { FC, memo, useEffect, useState } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { IProducts } from '../../types/productsType';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from '../../components';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './RelatedProduct.css';

import { Pagination, Navigation } from 'swiper';
interface IProps {
  catagory: string;
  currentProductId: string;
}
const RelatedProduct: FC<IProps> = ({ catagory, currentProductId }) => {
  const [relatedProduct, setRelatedProduct] = useState<IProducts[]>([]);
  useEffect(() => {
    (async () => {
      const data: any[] = [];
      const productRef = collection(db, 'products');
      const quryRef = query(productRef, where('catagory', '==', catagory), limit(12));
      const snapShot = await getDocs(quryRef);
      snapShot.forEach((chunk) => {
        data.push({ ...chunk.data(), id: chunk.id });
      });
      const productData: IProducts[] = data.filter((product) => product.id !== currentProductId);
      setRelatedProduct(productData);
    })();
  }, [catagory, currentProductId]);
  return (
    <div className='related-product'>
      <Swiper
        pagination={{ clickable: true }}
        navigation={true}
        slidesPerView={1}
        spaceBetween={0}
        modules={[Pagination, Navigation]}
        breakpoints={{ 950: { slidesPerView: 3 }, 650: { slidesPerView: 2 } }}
        lazy
      >
        {relatedProduct.map((product, i) => (
          <SwiperSlide key={i}>
            <ProductCard productData={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default memo(RelatedProduct);
