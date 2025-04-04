import { FC, useEffect, useState } from 'react';
import { BiLogInCircle, BiUser } from 'react-icons/bi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useAuth from '../../hook/useAuth';
import { useUserContext } from '../../context/User/UserContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

interface IProps {
  className?: string;
}

const LoginButton: FC<IProps> = ({ className = '' }) => {
  const { isAuth, loading } = useAuth();
  const { state } = useUserContext();
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (state.user?.uid) {
        try {
          const userRef = doc(db, 'users', state.user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            console.log('Rol del usuario:', data.rol);
            setRol(data.rol);
          } else {
            console.log('No se encontró el documento del usuario.');
          }
        } catch (error) {
          console.error('Error obteniendo el rol:', error);
        }
      }
    };

    fetchUserRole();
  }, [state.user?.uid]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuth) {
    return (
      <Link to='/sign-in' className={`header__register-button ${className}`}>
        <span>Inicia Sesión</span>
        <BiLogInCircle size={24} />
      </Link>
    );
  }

  return (
    <div className='flex gap-2 items-center'>
      <Link
        title={`Hola ${state.user.displayName}`}
        to='/profile'
        className={`header__register-button ${className}`}
      >
        <span>Perfil</span>
        <BiUser size={24} />
      </Link>

      {rol === 'admin' && (
        <Link
          title='Panel de administrador'
          to='/admin'
          className={`header__register-button ${className}`}
        >
          <span>Admin</span>
          <MdAdminPanelSettings size={24} />
        </Link>
      )}
    </div>
  );
};

export default LoginButton;
