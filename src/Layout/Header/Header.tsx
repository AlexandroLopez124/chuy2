import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileNav, Nav, ShopCart } from '../../components';
import menuData from '../../data/menuData';
import logo from '../../assets/svg/Logo.svg';
import './Header.css';
import LoginButton from '../../components/LoginButton/LoginButton';
import {Button} from '../../components';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut} from 'firebase/auth';
import { useLoader } from '../../context/Loader/LoaderContext';
import { useUserContext } from '../../context/User/UserContext';
import useToast from '../../hook/useToast';

const Header: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const { errorToast, succsesToast } = useToast();
  const { dispath, state } = useUserContext();
  const user = state.user;
  const { setLoader } = useLoader();
  const auth = getAuth();
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect((): any => {
    window.addEventListener('scroll', (): void => {
      if (window.scrollY > 80) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
    return (): void => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  const handleLogOut = async () => {
    try {
      setLoader(true);
      await signOut(auth);
      dispath({ type: 'LOG_OUT' });
      succsesToast('Saliste exitosamente', '');
      navigate('/');
      setLoader(false);
    } catch (error) {
      setLoader(false);
      errorToast('No puedes salirte', 'Intentelo de nuevo');
    }
  };

  return (
    <div className={`header-container ${show ? 'sticky' : ''}`}>
        {showConfirmLogout && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <h3>¿Estás seguro de que deseas salir?</h3>
              <p>Se cerrará tu sesión actual y volverás al inicio.</p>
              <div className="confirm-buttons">
                <Button
                  onClick={() => {
                    handleLogOut();
                    setShowConfirmLogout(false);
                  }}
                  className="confirm-button"
                >
                  Sí, salir
                </Button>
                <Button
                  onClick={() => setShowConfirmLogout(false)}
                  className="cancel-button"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      <div className={`header ${show ? 'sticky' : ''}`}>
        <MobileNav />
        <div className='header-left'>
          <Link to='/'>
            <img className='header-logo' src={logo} alt='logo of website' />
          </Link>
          <Nav links={menuData} />
        </div>
        <div className='header-right'>
          <ShopCart />
          <div className='header__login-button'>
            <LoginButton />
          </div>
          {user && (<Button onClick={() => setShowConfirmLogout(true)}className= 'header_logout-button'>
            Salir
          </Button> )}
        </div>
      </div>
    </div>
  );
};
export default Header;
