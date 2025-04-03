import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../Layout';
import phoneImage from '../../assets/image/concacaf.png';
import consoleImage from '../../assets/image/uefa.png';
import accImage from '../../assets/image/conmebol.png';
import headphoneImage from '../../assets/image/fifa.jpg';
import './Catagory.css';

const Catagory: FC = () => {
  return (
    <Container>
      <div className='catagory'>
        <Link className='catagory__link' to='phone'>
          <img className='catagory__image' src={phoneImage} alt="phone's picture" />
          <h4 className='catagory__text'>CONCACAF</h4>
        </Link>
        <Link className='catagory__link' to='headphone'>
          <img className='catagory__image' src={consoleImage} alt="phone's picture" />
          <h4 className='catagory__text'>UEFA</h4>
        </Link>
        <Link className='catagory__link' to='accessories'>
          <img className='catagory__image' src={accImage} alt="phone's picture" />
          <h4 className='catagory__text'>CONMEBOL</h4>
        </Link>
        <Link className='catagory__link' to='consols'>
          <img className='catagory__image' src={headphoneImage} alt="phone's picture" />
          <h4 className='catagory__text'>SELECCIONES</h4>
        </Link>
      </div>
    </Container>
  );
};

export default Catagory;
