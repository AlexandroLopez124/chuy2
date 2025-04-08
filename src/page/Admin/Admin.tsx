import { useUserContext } from '../../context/User/UserContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Admin.css';
import { Container, AdminSideBar } from '../../Layout';

const Admin: React.FC = () => {
  const loc = useLocation();
  const pathname = loc.pathname.split('/')[2];
  const {
    state: { user },
  } = useUserContext();
  return (
    <Container className='profile-container'>
      <div className='profile__sidebar'>
        <AdminSideBar />
      </div>
      <div className='profile__mobile-navigation'>
        <Link className={`profile__mobile-navigation__link ${pathname === 'management' ? 'active' : ''}`} to='management'>
          Gestionar Camisetas
        </Link>
        <Link className={`profile__mobile-navigation__link ${pathname === 'order' ? 'active' : ''}`} to='order'>
          Confirmar entregas
        </Link>
        <Link className={`profile__mobile-navigation__link ${pathname === 'pending' ? 'active' : ''}`} to='pending'>
          Pedidos Pendientes
        </Link>
      </div>
      <h2 className='profile__mobile__name'>{user.displayName}</h2>
      <div className='profile__content'>
        {loc.pathname.split('/')[2] ? (
          <Outlet />
        ) : (
          <div>
            <h2 className='profile__content__welcome-message '>Bienvenido {user.displayName} al Panel Administrador</h2>
            <p className='profile__content__welcome-sub-message'>
            Navegar entre las páginas de perfil mediante un enlace en la barra lateral izquierda{' '}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Admin;
