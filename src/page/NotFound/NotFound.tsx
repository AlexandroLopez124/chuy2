import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import './NotFound.css';

const NotFound: FC = () => {
  const navigate = useNavigate();
  return (
    <div className='not-found'>
      <h2 className='not-found__title'>404</h2>
      <h3 className='not-found__discription'>Pagina no encontrada</h3>
      <Button onClick={() => navigate('/')}>Volver al inicio</Button>
    </div>
  );
};

export default NotFound;
