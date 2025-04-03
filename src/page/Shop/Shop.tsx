import { FC, Fragment, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { collection, DocumentData, getDocs, limit, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import useInView from '../../hook/useInView';
import useToast from '../../hook/useToast';
import { IProducts } from '../../types/productsType';
import { Button, Loader, ProductCard, ProductCardLoading } from '../../components';
import { Container, Footer } from '../../Layout';
import './Shop.css';
import ProductContainer from '../../components/ProductsContainer/ProductContainer';

const Shop: FC = () => {
  const { errorToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<IProducts[]>([]);
  const [allProductSize, setAllProductSize] = useState<number>(0);
  const [lastProduct, setLastProduct] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [filterdProducts, setFilterdProducts] = useState<IProducts[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const categories = [
    { name: 'CONCACAF' },
    { name: 'UEFA' },
    { name: 'CONMEBOL' },
    { name: 'SELECCIONES' },
  ];

  const filterByCategory = (catagory: string) => {
    const filtered = products.filter(product => product.catagory === catagory);
    setFilterdProducts(filtered);
    setIsFilterOpen(false); // Cierra el menú al seleccionar
  };

  useEffect(() => {
    const allProducts: any[] = [];
    setLoading(true);
    (async () => {
      try {
        setAllProductSize((await getDocs(collection(db, 'products'))).size);
        const querySnap = query(collection(db, 'products'), limit(10));
        const snapShot = await getDocs(querySnap);
        snapShot.forEach((doc) => {
          const data = doc.data();
          allProducts.push(data);
        });
        const lastVisible = snapShot.docs[snapShot.docs.length - 1];
        setLoading(false);
        setLastProduct(lastVisible);
        setProducts(allProducts);
        setFilterdProducts(allProducts);
      } catch (error) {
        errorToast('No se pudieron cargar los productos', 'Inténtalo de nuevo');
      }
    })();
  }, []);

  const loadMoreProducts = async () => {
    const productsArray: any = [];
    try {
      setLoadMoreLoading(true);
      const nextProducts = query(collection(db, 'products'), startAfter(lastProduct), limit(10));
      const snapShot = await getDocs(nextProducts);
      snapShot.forEach((doc) => {
        const data = doc.data();
        productsArray.push(data);
      });
      const lastVisible = snapShot.docs[snapShot.docs.length - 1];
      setLoadMoreLoading(false);
      setLastProduct(lastVisible);
      setProducts([...products, ...productsArray]);
      setFilterdProducts([...filterdProducts, ...productsArray]);
    } catch (error) {
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilterdProducts(filtered);
  }, [products, searchQuery]);

  const { elementRef } = useInView(loadMoreProducts);
  
  return (
    <>
      <Container>
        <div className='shop'>
          <div className='shop__head'>
            <div className='shop__head__search'>
              <FiSearch className='shop__head__search-icon' />
              <input
                value={searchQuery}
                className='shop__head__search-input'
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Busca productos'
                type='text'
              />
            </div>
            <div className='shop__head__filter relative'>
              <Button
                title='Filtro'
                className='shop__head__filter-button secoundry'
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                Filtro
              </Button>
              {isFilterOpen && (
                <div className='absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200'>
                  <ul className='py-2'>
                    {categories.map((catagory, index) => (
                      <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <button 
                          onClick={() => filterByCategory(catagory.name)} 
                          className="block text-gray-700 w-full text-left"
                          style={{ appearance: 'none', border: 'none', background: 'none' }}
                        >
                          {catagory.name}
                        </button>
                      </li>
                    ))}
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <button 
                        onClick={() => setFilterdProducts(products)} 
                        className="block text-gray-700 w-full text-left"
                        style={{ appearance: 'none', border: 'none', background: 'none' }}
                      >
                        MOSTRAR TODOS
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className='shop__products-section'>
            <span className='shop__products__status'>
              1-{filterdProducts.length} de {allProductSize} productos
            </span>
            <ProductContainer>
              {loading && new Array(10).fill(0).map((_, i) => <ProductCardLoading key={i} />)}
              {filterdProducts.map((product, i) => (
                <Fragment key={i}>
                  <ProductCard productData={product} />
                </Fragment>
              ))}
              <div ref={elementRef}></div>
            </ProductContainer>
            {filterdProducts.length <= 0 && (
              <div className='shop__products__not-found'>
                <h4 className='shop__products__not-found__text'>
                  No se encontraron productos
                </h4>
              </div>
            )}
            {loadMoreLoading && <Loader />}
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Shop;
