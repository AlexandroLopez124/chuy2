import slider1 from '../assets/image/slider-1.png';
import slider2 from '../assets/image/slider-2.png';
import slider3 from '../assets/image/slider-3.png';

interface ISliderData {
  imgUrl: string;
  title: string;
  description: string;
  shopUrl: string;
  productUrl: string;
}
const sliderData: ISliderData[] = [
  {
    imgUrl: slider1,
    title: 'Viste tu pasión, juega con estilo',
    description:
      'Encuentra las mejores camisetas de tus equipos favoritos. ¡Compra ahora y lleva el fútbol contigo!',
    shopUrl: '#',
    productUrl: '#',
  },
  {
    imgUrl: slider2,
    title: 'Las mejores camisetas de clubes de todo el mundo',
    description:
      'Desde Europa hasta América, encuentra los jerseys de los equipos más icónicos del planeta. ¡Elige el tuyo y juega con estilo!',
    shopUrl: '#',
    productUrl: '#',
  },
  {
    imgUrl: slider3,
    title: 'Viste los colores de tu selección favorita',
    description:
      'Apoya a tu país con camisetas de selecciones nacionales de todo el mundo. ¡Siente la pasión del fútbol y hazla tuya!',
    shopUrl: '#',
    productUrl: '#',
  },
];

export default sliderData;
