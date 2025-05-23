import { BiGitCompare, BiSearch, BiHeart } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/Cart/CartContext';
import { IProducts } from '../../types/productsType';
import './ProductCard.css';
interface Props {
  productData: IProducts;
}
const ProductCard: React.FC<Props> = ({ productData }) => {
  const { addToCart } = useCartContext();
  const navigate = useNavigate();
  const discountPrice = (productData.price - (productData.price * productData.discountPercent) / 100).toFixed(2);

  const handleOpenProduct = (): void => {
    navigate(`/product/${productData.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    addToCart(productData, 1);
  };

  return (
    <div onClick={handleOpenProduct} className='product-card'>
      {productData.discountPercent > 0 && (
        <div className='product-card__discount-percent'>-{productData.discountPercent}%</div>
      )}

      <div className='product-card__image'>
        <img
          className='product-card__image-image'
          loading='lazy'
          src={productData.imageUrls[0]}
          alt={productData.name}
        />
        {/* <button disabled={!productData.inStock} onClick={handleAddToCart} className='add-to-cart'>
          <h2>{productData.inStock ? 'Añadir al carrito' : 'Ya no hay'}</h2>
        </button> */}
      </div>
      <div className='product-card__content'>
        <h4 className='product-card__name'>{productData.name}</h4>
        <div className='product-card__content__price'>
          {productData.discountPercent > 0 && <del className='product-card__regular-price'>{productData.price}</del>}
          <span className='product-card__discount-price'>{discountPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
