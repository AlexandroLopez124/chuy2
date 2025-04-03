import { FC } from 'react';
import { BiLogInCircle, BiUser } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import useAuth from '../../hook/useAuth';
import { useUserContext } from '../../context/User/UserContext';

interface IProps {
  className?: string;
}
const LoginButton: FC<IProps> = ({ className = '' }) => {
  const { isAuth, loading } = useAuth();
  const { state } = useUserContext();
  if (loading) {
    return <div>Cargando...</div>;
  }
  return isAuth ? (
    <Link title={`Hola ${state.user.displayName}`} to='/profile' className={`header__register-button ${className}`}>
      <span>Perfil</span>
      <BiUser size={24} />
    </Link>
  ) : (
    <Link to='/sign-in' className={`header__register-button ${className}`}>
      <span>Inicia Sesion</span>
      <BiLogInCircle size={24} />
    </Link>
  );
};
export default LoginButton;
