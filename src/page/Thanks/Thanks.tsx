import { FC } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { Container } from '../../Layout';
import './Thanks.css';

const Thanks: FC = () => {
  const location: any = useLocation();
  const navigate = useNavigate();
  if (!location.state.inApp || location.state.orderId === undefined) {
    return <Navigate replace to='/' />;
  }

  return (
    <Container className='thanks-page__container'>
      <div className='thanks-page'>
        <h2 className='thanks-page__title'>Gracias por su compra</h2>
        <p className='thanks-page__discription'>El pedido será enviada hacia usted</p>
      </div>
      <hr className='thanks-page__line' />
      <div className='thanks-page__order'>
        <h4 className='thanks-page__order-title'>Tu Id del pedido es : {location.state.orderId}</h4>
        <p className='thanks-page__order-discription'>Puedes ver tu pedido en el perfil</p>
        <Button onClick={() => navigate('/profile/order')}>Ir a Mis Pedidos</Button>
      </div>
    </Container>
  );
};

export default Thanks;
